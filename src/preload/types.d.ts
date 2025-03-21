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
  sendAdvanceData: (
    sourceUrlList: string[],
    targetUrlList: string[],
    viewPortSize: number,
    basicAuthentication: BasicAuthentication
  ) => void;
  onDiff: (callback: (diffData: { pixelList: string[]; imageList: string[] }) => void) => void;
  saveImage: (ImageData: Base64, index: number) => void;
  errorAlert: (message: string) => void;
};

declare global {
  interface Window {
    electron: ElectronAPI;
    api: Api;
  }
}
