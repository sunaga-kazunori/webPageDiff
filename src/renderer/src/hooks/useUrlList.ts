import { useEffect, useState } from 'react';
import { convertArray } from '../utilities/common';

type UseUrlList = {
  urlText: string;
  setUrlText: React.Dispatch<React.SetStateAction<string>>;
  urlList: string[];
};

/**
 * URLリストの管理を行うカスタムフック
 *
 * @returns {UseUrlList} URLテキスト、URLリスト、URLテキストの状態更新関数
 */
export const useUrlList = (): UseUrlList => {
  const [urlText, setUrlText] = useState('');
  const [urlList, setUrlList] = useState<string[]>([]);

  useEffect(() => {
    setUrlList(convertArray(urlText));
  }, [urlText]);

  return { urlText, setUrlText, urlList };
};
