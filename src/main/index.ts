import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import fs from 'fs';
import os from 'os';
import path, { join } from 'path';
import { PNG } from 'pngjs';
import puppeteer from 'puppeteer';
import icon from '../../resources/icon.png?asset';
import { BasicAuthentication } from '../preload/types';
import { errorData } from '../shared/constants';

type DiffImageList = string[];
type DiffPixelList = (string | number)[];

let mainWindow: null | BrowserWindow = null;

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 720,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // electron-vite cliを基にしたレンダラのHMR
  // 開発中はリモートURLを読み込み、本番環境ではローカルのhtmlファイルを読み込む
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
};

// このメソッドはElectronが初期化を終了し、ブラウザウィンドウを作成する準備ができたときに呼び出される
app.whenReady().then(() => {
  // Windows向けにアプリのユーザーモデルIDを設定
  electronApp.setAppUserModelId('com.electron');

  // 開発中はF12でデベロッパーツールを開閉でき、本番環境ではCommandOrControl + Rを無視する。
  // 詳細は https://github.com/alex8088/electron-toolkit/tree/master/packages/utils を参照
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  // ユーザーが入力した情報を元に差分量の確認・差分画像の作成を行う
  ipcMain.on(
    'sendAdvanceData',
    async (
      _,
      sourceUrlList: string[],
      targetUrlList: string[],
      viewPortSize: number,
      basicAuthentication: BasicAuthentication
    ) => {
      const diffImageList: DiffImageList = [];
      const diffPixelList: DiffPixelList = [];
      const sourceUrlUserName = basicAuthentication.sourceUrl.userName;
      const sourceUrlUserPassword = basicAuthentication.sourceUrl.password;
      const targetUrlUserName = basicAuthentication.targetUrl.userName;
      const targetUrlUserPassword = basicAuthentication.targetUrl.password;
      const browser = await puppeteer.launch();
      const tempDirectory = path.join(os.tmpdir(), 'webPageDiff-temp');

      if (!fs.existsSync(tempDirectory)) {
        fs.mkdirSync(tempDirectory);
      }

      // 並列で処理を行うと処理が途中で止まることがあるため直列で処理を行う
      for (let index = 0; index < sourceUrlList.length; index++) {
        const page = await browser.newPage();
        await page.setViewport({ width: viewPortSize, height: 1000 });

        if (sourceUrlUserName && sourceUrlUserPassword) {
          await page.authenticate({
            username: sourceUrlUserName,
            password: sourceUrlUserPassword
          });
        }

        try {
          await page.goto(sourceUrlList[index], { waitUntil: 'networkidle2', timeout: 30000 });
        } catch (error) {
          if (error instanceof Error && error.message.includes('ERR_INVALID_AUTH_CREDENTIALS')) {
            diffPixelList.push(errorData.basicAuthentication);
            diffImageList.push(errorData.basicAuthentication);
          } else {
            diffPixelList.push(errorData.pageAccess);
            diffImageList.push(errorData.pageAccess);
          }

          return;
        }

        // 遅延読み込みなどで初期状態では表示されない要素の表示を行うたためページ最下部までスクロールを行う
        await page.evaluate(() => {
          scroll(0, 99999);
        });

        const sourceScreenshotPath = `${tempDirectory}${index}-source.png`;
        await page.screenshot({ path: sourceScreenshotPath, fullPage: true });

        if (targetUrlUserName && targetUrlUserPassword) {
          await page.authenticate({
            username: targetUrlUserName,
            password: targetUrlUserPassword
          });
        }

        try {
          await page.goto(targetUrlList[index], { waitUntil: 'networkidle2', timeout: 30000 });
        } catch (_) {
          diffPixelList.push(errorData.basicAuthentication);
          diffImageList.push(errorData.basicAuthentication);

          return;
        }

        await page.evaluate(() => {
          scroll(0, 99999);
        });

        const targetScreenshotPath = `${tempDirectory}${index}-target.png`;
        await page.screenshot({ path: targetScreenshotPath, fullPage: true });

        const sourceImage = await PNG.sync.read(await fs.promises.readFile(sourceScreenshotPath));
        const targetImage = await PNG.sync.read(await fs.promises.readFile(targetScreenshotPath));
        const { width, height } = sourceImage;
        const diffImage = new PNG({ width, height });
        const { default: pixelmatch } = await import('pixelmatch');

        try {
          const diffPixel = pixelmatch(
            sourceImage.data,
            targetImage.data,
            diffImage.data,
            width,
            height,
            { threshold: 0.1 }
          );

          diffPixelList.push(diffPixel);
        } catch (error) {
          diffPixelList.push(errorData.imageSize);
          diffImageList.push(errorData.imageSize);
        }

        const chunks: Buffer[] = [];

        try {
          await new Promise<void>((resolve, reject) => {
            diffImage
              .pack()
              .on('data', (chunk) => {
                chunks.push(chunk);
              })
              .on('end', () => {
                try {
                  const buffer = Buffer.concat(chunks);
                  const base64Image = buffer.toString('base64');
                  diffImageList.push(base64Image);
                  resolve();
                } catch (error) {
                  reject(error);
                }
              })
              .on('error', reject);
          });
        } catch (_) {
          diffImageList.push(errorData.diffImage);
        }

        await page.close();
      }

      fs.rmSync(tempDirectory, { recursive: true });

      await browser.close();
      mainWindow?.webContents.send('onDiff', {
        imageList: diffImageList,
        pixelList: diffPixelList
      });
    }
  );

  // 画像保存のダイアログを表示
  ipcMain.on('saveImage', async (_, imageData, index) => {
    const { filePath } = await dialog.showSaveDialog({
      title: '画像を保存',
      defaultPath: `No${index + 1}`,
      filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg'] }]
    });

    if (filePath) {
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      fs.writeFile(filePath, buffer, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
  });

  ipcMain.handle('errorAlert', (_, message) => {
    dialog.showErrorBox('', message);
  });
});

// すべてのウィンドウが閉じられたときに終了する
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
