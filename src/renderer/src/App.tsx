import { useEffect, useState } from 'react';
import ExecutionButton from './components/executionButton';
import Table from './components/Table';
import Textarea from './components/Textarea';
import { convertArray } from './utilities/common';
import { validateForDiffCheck } from './utilities/validateForDiffCheck';

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

  useEffect(() => {
    setSourceUrlList(convertArray(sourceUrlText));
  }, [sourceUrlText]);

  useEffect(() => {
    setTargetUrlList(convertArray(targetUrlText));
  }, [targetUrlText]);

  const errorMessages = {
    mismatch: 'テキストエリアに入力されたURLの数が異なります。URLの数を揃えてください。',
    invalidValue: '無効なURLが含まれています。もう一度確認してください。',
    offline: 'ネットワークに接続されていません。インターネット接続を確認してください。',
    empty: 'URLが入力されていません。もう一度確認してください。'
  };

  const handleClick = (): void => {
    const { isValid, errorMessage } = validateForDiffCheck(
      sourceUrlList,
      targetUrlList,
      errorMessages
    );

    if (!isValid && errorMessage) {
      window.api.errorAlert(errorMessage);

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
            setUrlText={setSourceUrlText}
            isReset={isReset}
            setIsReset={setIsReset}
          ></Textarea>
          <Textarea
            label="URLを入力"
            setUrlText={setTargetUrlText}
            isReset={isReset}
            setIsReset={setIsReset}
          ></Textarea>
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
