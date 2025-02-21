import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge, ipcRenderer } from 'electron';
import { Api } from './types';

// Custom APIs for renderer
const api: Api = {
  sendUrlList: (sourceUrlList: string[], targetUrlList: string[]) =>
    ipcRenderer.send('sendUrlList', sourceUrlList, targetUrlList),
  onDiffImageList: (callback) =>
    ipcRenderer.on('onDiffImageList', (_event, diffPixelList) => callback(diffPixelList)),
  onDiffPixelList: (callback) =>
    ipcRenderer.on('onDiffPixelList', (_event, diffPixelList) => callback(diffPixelList))
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
