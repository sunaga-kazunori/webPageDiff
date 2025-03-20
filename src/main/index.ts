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

function createWindow(): void {
  // Create the browser window.
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

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on('ping', () => console.log('pong'));

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  ipcMain.on(
    'sendUrlList',
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

      await browser.close();
      mainWindow?.webContents.send('onDiff', {
        imageList: diffImageList,
        pixelList: diffPixelList
      });
    }
  );

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

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
