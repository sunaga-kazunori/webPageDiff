import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge, ipcRenderer } from 'electron';
import { Api } from './types';

/** レンダラープロセス用のカスタムAPI */
const api: Api = {
  sendAdvanceData: (sourceUrlList, targetUrlList, viewPortSize, basicAuthentication) =>
    ipcRenderer.send(
      'sendAdvanceData',
      sourceUrlList,
      targetUrlList,
      viewPortSize,
      basicAuthentication
    ),
  onDiff: (callback) =>
    ipcRenderer.on(
      'onDiff',
      (
        _event,
        diffData: {
          pixelList: string[];
          imageList: string[];
        }
      ) => callback(diffData)
    ),
  saveImage: (imageData, index) => ipcRenderer.send('saveImage', imageData, index),
  errorAlert: (message) => ipcRenderer.invoke('errorAlert', message)
};

// `context isolation` が有効になっている場合のみ、`contextBridge` APIを使用して
// Electron APIをレンダラに公開。それ以外の場合は、DOMのグローバルに追加
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
