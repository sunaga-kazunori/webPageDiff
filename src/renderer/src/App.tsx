import { useEffect, useState } from 'react';
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

  const convertArray = (text: string): string[] =>
    text.split('\n').filter((url) => url.trim() !== '');

  useEffect(() => {
    setSourceUrlList(convertArray(sourceUrlText));
  }, [sourceUrlText]);

  useEffect(() => {
    setTargetUrlList(convertArray(targetUrlText));
  }, [targetUrlText]);

  const handleClick = (): void => {
    window.api.sendUrlList(sourceUrlList, targetUrlList);
  };

  useEffect(() => {
    window.api.onDiffImageList((_diffImageList) => {
      setDiffImageList(_diffImageList);
    });
    window.api.onDiffPixelList((_diffPixelList) => {
      setDiffPixelList(_diffPixelList);
    });
  }, []);

  return (
    <>
      <div className="grid grid-cols-[30%_1fr] grid-rows-[100dvh]">
        <div className="p-5">
          <Textarea label="URLを入力" setUrlText={setSourceUrlText}></Textarea>
          <Textarea label="URLを入力" setUrlText={setTargetUrlText}></Textarea>
          <div className="mt-5">
            <ExecutionButton handleClick={handleClick}>差分確認</ExecutionButton>
          </div>
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
