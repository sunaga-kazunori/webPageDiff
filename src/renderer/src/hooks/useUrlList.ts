import { convertArray } from '@renderer/utilities/common';
import { useEffect, useState } from 'react';

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
