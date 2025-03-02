import { ElectronAPI } from '@electron-toolkit/preload';

export type Api = {
  sendUrlList: (sourceUrlList: string[], targetUrlList: string[], viewPortSize: number) => void;
  onDiffImageList: (callback: (diffPixelList: string[]) => void) => void;
  onDiffPixelList: (callback: (diffPixelList: string[]) => void) => void;
  saveImage: (ImageData: Base64, index: number) => void;
  errorAlert: (message: string) => void;
};

declare global {
  interface Window {
    electron: ElectronAPI;
    api: Api;
  }
}
