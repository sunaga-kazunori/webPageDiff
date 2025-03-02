import { useEffect, useState } from 'react';
import ExecutionButton from './components/executionButton';
import TabItem from './components/TabItem';
import Table from './components/Table';
import Tabs from './components/Tabs';
import Textarea from './components/Textarea';
import ViewPortSizeInput from './components/ViewPortSizeInput';
import { useReset } from './hooks/useReset';
import { useUrlList } from './hooks/useUrlList';
import { validateForDiffCheck } from './utilities/validateForDiffCheck';

function App(): JSX.Element {
  const DEFAULT_VIEWPORT_SIZE = 1280;
  const [diffImageList, setDiffImageList] = useState<string[]>([]);
  const [diffPixelList, setDiffPixelList] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [hasCheckedDiff, setHasCheckedDiff] = useState(false);
  const [viewPortSize, setViewPortSize] = useState(DEFAULT_VIEWPORT_SIZE);
  const sourceUrlState = useUrlList();
  const targetUrlState = useUrlList();

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
  };

  const { isReset, reset } = useReset(_reset);

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

    setLoading(true);
    window.api.sendUrlList(sourceUrlState.urlList, targetUrlState.urlList, viewPortSize);
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
          <ViewPortSizeInput
            label="差分画像のビューポート幅を入力"
            viewPortSize={viewPortSize}
            setViewPortSize={setViewPortSize}
          ></ViewPortSizeInput>
          <Tabs>
            <TabItem label="Source URL">
              <Textarea
                label="Source URLを入力"
                setUrlText={sourceUrlState.setUrlText}
                isReset={isReset}
              ></Textarea>
            </TabItem>
            <TabItem label="Target URL">
              <Textarea
                label="Target URLを入力"
                setUrlText={targetUrlState.setUrlText}
                isReset={isReset}
              ></Textarea>
            </TabItem>
          </Tabs>
          <div className="mt-5">
            <ExecutionButton handleClick={handleCheckedDiffClick}>差分確認</ExecutionButton>
          </div>
          {hasCheckedDiff && (
            <ExecutionButton handleClick={reset} className="relative z-10">
              リセット
            </ExecutionButton>
          )}
        </div>
        <div className="border-l-2 border-l-black">
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
