import { useEffect, useState } from 'react';
import ErrorMessage from './components/ErrorMessage';
import ExecutionButton from './components/executionButton';
import Table from './components/Table';
import Textarea from './components/Textarea';

function App(): JSX.Element {
  const [sourceUrlText, setSourceUrlText] = useState('');
  const [targetUrlText, setTargetUrlText] = useState('');
  const [sourceUrlList, setSourceUrlList] = useState<string[]>([]);
  const [targetUrlList, setTargetUrlList] = useState<string[]>([]);
  const [diffImageList, setDiffImageList] = useState<string[]>([]);
  const [diffPixelList, setDiffPixelList] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [hasCheckedDiff, setHasCheckedDiff] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [isSourceUrlError, setIsSourceUrlError] = useState(false);
  const [isTargetUrlError, setIsTargetUrlError] = useState(false);

  const convertArray = (text: string): string[] =>
    text.split('\n').filter((url) => url.trim() !== '');

  useEffect(() => {
    setSourceUrlList(convertArray(sourceUrlText));
  }, [sourceUrlText]);

  useEffect(() => {
    setTargetUrlList(convertArray(targetUrlText));
  }, [targetUrlText]);

  const errorUrlMessageText = {
    mismatch: 'テキストエリアに入力されたURLの数が異なります。URLの数を揃えてください。',
    invalidValue: '無効なURLが含まれています。もう一度確認してください。',
    offline: 'ネットワークに接続されていません。インターネット接続を確認してください。',
    empty: 'URLが入力されていません。もう一度確認してください。'
  };

  const checkOnlineStatus = (): boolean => {
    if (!window.navigator.onLine) {
      window.api.errorAlert(errorUrlMessageText.offline);

      return false;
    }

    return true;
  };

  const checkUrlEmpty = (): boolean => {
    if (sourceUrlList.length === 0 && targetUrlList.length === 0) {
      window.api.errorAlert(errorUrlMessageText.empty);

      return false;
    }

    return true;
  };

  const checkUrlMismatch = (): boolean => {
    if (sourceUrlList.length !== targetUrlList.length) {
      window.api.errorAlert(errorUrlMessageText.mismatch);

      return false;
    }

    return true;
  };

  const checkUrlInvalidValue = (urls: string[]): boolean => {
    for (const url of urls) {
      if (!URL.canParse(url)) {
        window.api.errorAlert(errorUrlMessageText.invalidValue);

        return false;
      }
    }

    return true;
  };

  const handleClick = (): void => {
    if (
      !checkOnlineStatus() ||
      !checkUrlEmpty() ||
      !checkUrlMismatch() ||
      !checkUrlInvalidValue([...sourceUrlList, ...targetUrlList])
    ) {
      return;
    }

    setLoading(true);
    window.api.sendUrlList(sourceUrlList, targetUrlList);
  };

  const handleResetClick = (): void => {
    setIsReset(true);
    setHasCheckedDiff(false);
  };

  useEffect(() => {
    window.api.onDiffImageList((_diffImageList) => {
      setDiffImageList(_diffImageList);
      setLoading(false);
      setHasCheckedDiff(true);
    });
    window.api.onDiffPixelList((_diffPixelList) => {
      setDiffPixelList(_diffPixelList);
    });
  }, []);

  useEffect(() => {
    if (isReset) {
      setSourceUrlText('');
      setTargetUrlText('');
      setDiffImageList([]);
      setDiffPixelList([]);
    }
  }, [isReset]);

  return (
    <>
      {isLoading && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1] text-[#fff]">
          Loading...
        </div>
      )}
      <div
        className={`grid grid-cols-[30%_1fr] grid-rows-[100dvh] relative after:fixed after:top-0 after:right-0 after:bottom-0 after:left-0 after:pointer-events-none after:content-[''] after:bg-black after:opacity-0 after:transition-opacity after:duration-200
      ${isLoading ? 'after:pointer-events-auto after:opacity-70' : ''}`}
        {...(isLoading ? { inert: 'true' } : {})}
      >
        <div
          className={`p-5 relative after:absolute after:top-0 after:right-0 after:bottom-0 after:left-0 after:pointer-events-none after:content-[''] after:bg-black after:opacity-0 after:transition-opacity after:duration-200
        ${hasCheckedDiff ? 'after:pointer-events-auto after:opacity-70' : ''}`}
        >
          <Textarea
            label="URLを入力"
            urlList={sourceUrlList}
            setUrlText={setSourceUrlText}
            isReset={isReset}
            setIsReset={setIsReset}
            setIsUrlError={setIsSourceUrlError}
          ></Textarea>
          {isSourceUrlError && (
            <ErrorMessage message={errorUrlMessageText.invalidValue}></ErrorMessage>
          )}
          <Textarea
            label="URLを入力"
            urlList={targetUrlList}
            setUrlText={setTargetUrlText}
            isReset={isReset}
            setIsReset={setIsReset}
            setIsUrlError={setIsTargetUrlError}
          ></Textarea>
          {isTargetUrlError && (
            <ErrorMessage message={errorUrlMessageText.invalidValue}></ErrorMessage>
          )}
          <div className="mt-5">
            <ExecutionButton handleClick={handleClick}>差分確認</ExecutionButton>
          </div>
          {hasCheckedDiff && (
            <ExecutionButton handleClick={handleResetClick} className="relative z-10">
              リセット
            </ExecutionButton>
          )}
        </div>
        <div className="border-l-2 border-l-black">
          <Table
            sourceUrlList={sourceUrlList}
            targetUrlList={targetUrlList}
            diffPixelList={diffPixelList}
            diffImageList={diffImageList}
          ></Table>
        </div>
      </div>
    </>
  );
}

export default App;
