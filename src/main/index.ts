import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import fs from 'fs';
import os from 'os';
import path, { join } from 'path';
import { PNG } from 'pngjs';
import puppeteer from 'puppeteer';
import icon from '../../resources/icon.png?asset';

type DiffImageList = string[];
type DiffPixelList = string[];

let mainWindow: null | BrowserWindow = null;

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
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

  ipcMain.on('sendUrlList', async (_event, sourceUrlList: string[], targetUrlList: string[]) => {
    const diffImageList: DiffImageList = [];
    const diffPixelList: DiffPixelList = [];
    const browser = await puppeteer.launch();

    for (let index = 0; index < sourceUrlList.length; index++) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 1000 });

      await page.goto(sourceUrlList[index], { waitUntil: ['networkidle0'] });

      const tempDirectory = path.join(os.tmpdir(), 'webPageDiff-temp');

      if (!fs.existsSync(tempDirectory)) {
        fs.mkdirSync(tempDirectory);
      }

      await page.screenshot({
        path: `${tempDirectory}${index}-source.png`,
        fullPage: true
      });

      await page.goto(targetUrlList[index], { waitUntil: ['networkidle0'] });

      await page.screenshot({
        path: `${tempDirectory}${index}-target.png`,
        fullPage: true
      });

      const sourceImage = await PNG.sync.read(
        fs.readFileSync(`${tempDirectory}${index}-source.png`)
      );
      const targetImage = await PNG.sync.read(
        fs.readFileSync(`${tempDirectory}${index}-target.png`)
      );
      const { width, height } = sourceImage;
      const diffImage = new PNG({ width, height });
      const { default: pixelmatch } = await import('pixelmatch');
      const diffPixel = pixelmatch(
        sourceImage.data,
        targetImage.data,
        diffImage.data,
        width,
        height,
        {
          threshold: 0.1
        }
      );

      diffPixelList.push(diffPixel);

      await new Promise<void>((resolve, reject) => {
        const chunks: Buffer[] = [];

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
    }

    await browser.close();

    mainWindow?.webContents.send('onDiffImageList', diffImageList);
    mainWindow?.webContents.send('onDiffPixelList', diffPixelList);
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
