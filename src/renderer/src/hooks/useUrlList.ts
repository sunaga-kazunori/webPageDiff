import { useEffect, useState } from 'react';
import { convertArray } from '../utilities/common';

export const useUrlList = (): {
  urlText: string;
  setUrlText: React.Dispatch<React.SetStateAction<string>>;
  urlList: string[];
} => {
  const [urlText, setUrlText] = useState('');
  const [urlList, setUrlList] = useState<string[]>([]);

  useEffect(() => {
    setUrlList(convertArray(urlText));
  }, [urlText]);

  return { urlText, setUrlText, urlList };
};
