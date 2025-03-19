import { useEffect, useState } from 'react';
import Button from './components/Button';
import ErrorMessage from './components/ErrorMessage';
import LoadingSpinner from './components/LoadingSpinner';
import TabItem from './components/TabItem';
import Table from './components/Table';
import Tabs from './components/Tabs';
import UrlInput from './components/UrlInput';
import ViewPortSizeInput from './components/ViewPortSizeInput';
import { useBasicAuthentication } from './hooks/useBasicAuthentication ';
import { useReset } from './hooks/useReset';
import { useUrlList } from './hooks/useUrlList';
import { validateForDiffCheck } from './utilities/validateForDiffCheck';

function App(): JSX.Element {
  const DEFAULT_VIEWPORT_SIZE = 1280;
  const [diffImageList, setDiffImageList] = useState<string[]>([]);
  const [diffPixelList, setDiffPixelList] = useState<(string | number)[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [hasCheckedDiff, setHasCheckedDiff] = useState(false);
  const [viewPortSize, setViewPortSize] = useState(DEFAULT_VIEWPORT_SIZE);
  const sourceUrlState = useUrlList();
  const targetUrlState = useUrlList();
  const sourceBasicAuthentication = useBasicAuthentication();
  const targetBasicAuthentication = useBasicAuthentication();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const errorMessages = {
    mismatch: 'テキストエリアに入力されたURLの数が異なります。URLの数を揃えてください。',
    invalidValue: '無効なURLが含まれています。もう一度確認してください。',
    offline: 'ネットワークに接続されていません。インターネット接続を確認してください。',
    empty: 'URLが入力されていません。もう一度確認してください。',
    invalidViewPortSize:
      '入力されたビューポート幅は無効な値です。値は200を超え、かつ10000未満である必要があります。再度正しい値を入力してください。'
  };

  const _reset = (): void => {
    setHasCheckedDiff(false);
    setViewPortSize(DEFAULT_VIEWPORT_SIZE);
    sourceUrlState.setUrlText('');
    targetUrlState.setUrlText('');
    setDiffImageList([]);
    setDiffPixelList([]);
    setActiveTabIndex(0);
    sourceBasicAuthentication.setIsChecked(false);
    targetBasicAuthentication.setIsChecked(false);
  };

  const { reset } = useReset(_reset);

  const { isValid, errorMessage } = validateForDiffCheck(
    sourceUrlState.urlList,
    targetUrlState.urlList,
    viewPortSize,
    errorMessages
  );

  const handleCheckedDiffClick = (): void => {
    if (!isValid && errorMessage) {
      window.api.errorAlert(errorMessage);

      return;
    }

    const basicAuthentication = {
      sourceUrl: {
        userName: sourceBasicAuthentication.username,
        password: sourceBasicAuthentication.password
      },
      targetUrl: {
        userName: targetBasicAuthentication.username,
        password: targetBasicAuthentication.password
      }
    };

    setLoading(true);
    window.api.sendUrlList(
      sourceUrlState.urlList,
      targetUrlState.urlList,
      viewPortSize,
      basicAuthentication
    );
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

  return (
    <>
      {isLoading && <LoadingSpinner label="Loading..."></LoadingSpinner>}

      <div
        className={`grid grid-cols-[30%_1fr] grid-rows-[100dvh] relative after:fixed after:top-0 after:right-0 after:bottom-0 after:left-0 after:pointer-events-none after:content-[''] after:bg-black after:opacity-0 after:transition-opacity after:duration-200
      ${isLoading ? 'after:pointer-events-auto after:opacity-70' : ''}`}
        {...(isLoading ? { inert: 'true' } : {})}
      >
        <div
          className={`p-5 relative after:absolute after:top-0 after:right-0 after:bottom-0 after:left-0 after:pointer-events-none after:content-[''] after:bg-black after:opacity-0 after:transition-opacity after:duration-200 overflow-y-auto
        ${hasCheckedDiff ? 'after:pointer-events-auto after:opacity-70' : ''}`}
        >
          <div {...(hasCheckedDiff ? { inert: 'true' } : {})}>
            <Tabs activeIndex={activeTabIndex} setActiveIndex={setActiveTabIndex}>
              <TabItem label="Source URL">
                <UrlInput
                  urlState={sourceUrlState}
                  basicAuthenticationState={sourceBasicAuthentication}
                  label="Source URLを入力"
                ></UrlInput>
              </TabItem>
              <TabItem label="Target URL">
                <UrlInput
                  urlState={targetUrlState}
                  basicAuthenticationState={targetBasicAuthentication}
                  label="Target URLを入力"
                ></UrlInput>
              </TabItem>
            </Tabs>
            <ViewPortSizeInput
              label="差分を確認するビューポート幅を入力"
              viewPortSize={viewPortSize}
              setViewPortSize={setViewPortSize}
            ></ViewPortSizeInput>
            <div className="mt-10 text-center text-lg font-bold">
              <Button handleClick={handleCheckedDiffClick} label="差分確認"></Button>
            </div>
          </div>
          {hasCheckedDiff && (
            <Button
              label="リセット"
              handleClick={reset}
              className="top-1/2 absolute left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-red-500 hover:bg-red-600 font-bold"
            ></Button>
          )}
        </div>
        <div className="bg-gray-50 p-4 overflow-y-auto">
          <ErrorMessage diffPixelList={diffPixelList} diffImageList={diffImageList}></ErrorMessage>
          <Table
            sourceUrlList={sourceUrlState.urlList}
            targetUrlList={targetUrlState.urlList}
            diffPixelList={diffPixelList}
            diffImageList={diffImageList}
          ></Table>
        </div>
      </div>
    </>
  );
}

export default App;
