import { ElectronAPI } from '@electron-toolkit/preload';

type BasicAuthentication = {
  sourceUrl: {
    userName: string;
    password: string;
  };
  targetUrl: {
    userName: string;
    password: string;
  };
};

export type Api = {
  sendUrlList: (
    sourceUrlList: string[],
    targetUrlList: string[],
    viewPortSize: number,
    basicAuthentication: BasicAuthentication
  ) => void;
  onDiffImageList: (callback: (diffPixelList: string[]) => void) => void;
  onDiffPixelList: (callback: (diffPixelList: number[]) => void) => void;
  saveImage: (ImageData: Base64, index: number) => void;
  errorAlert: (message: string) => void;
};

declare global {
  interface Window {
    electron: ElectronAPI;
    api: Api;
  }
}
