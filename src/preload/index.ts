import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge, ipcRenderer } from 'electron';
import { Api } from './types';

// Custom APIs for renderer
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

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
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
