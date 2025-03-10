import React from 'react';
import { errorData } from '../../../shared/constants';
import Button from './Button';

type Props = {
  sourceUrlList: string[];
  targetUrlList: string[];
  diffPixelList: (string | number)[];
  diffImageList: string[];
};

const Table: React.FC<Props> = ({ sourceUrlList, targetUrlList, diffPixelList, diffImageList }) => {
  const maxLength = Math.max(sourceUrlList.length, targetUrlList.length);

  if (maxLength === 0) {
    return null;
  }

  return (
    <table className="table-auto w-full border-collapse border border-gray-300 mt-5">
      <colgroup>
        <col className="w-[10%]" />
        <col className={diffPixelList.length === 0 ? 'w-[45%]' : 'w-[30%]'} />
        <col className={diffPixelList.length === 0 ? 'w-[45%]' : 'w-[30%]'} />
        {diffPixelList.length !== 0 && (
          <>
            <col className="w-[15%]" />
            <col className="w-[15%]" />
          </>
        )}
      </colgroup>

      <thead>
        <tr>
          <th className="border border-gray-300 px-4 py-2 bg-white">No</th>
          <th className="border border-gray-300 px-4 py-2 bg-white">Source URL</th>
          <th className="border border-gray-300 px-4 py-2 bg-white">Target URL</th>
          {diffPixelList.length !== 0 && (
            <>
              <th className="border border-gray-300 px-4 py-2 bg-white">差分量（px）</th>
              <th className="border border-gray-300 px-4 py-2 bg-white">差分画像</th>
            </>
          )}
        </tr>
      </thead>

      <tbody>
        {Array.from({ length: maxLength }).map((_, index) => {
          const sourceUrl = sourceUrlList[index] || '';
          const targetUrl = targetUrlList[index] || '';
          const handleClick = (): void => {
            window.api.saveImage(diffImageList[index], index);
          };

          return (
            <tr key={crypto.randomUUID()} className="odd:bg-gray-100 even:bg-white">
              <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2 break-all">{sourceUrl}</td>
              <td className="border border-gray-300 px-4 py-2 break-all">{targetUrl}</td>
              {diffPixelList.length !== 0 && (
                <>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {diffPixelList[index] === 0 ? (
                      '0'
                    ) : (
                      <>
                        {diffPixelList[index] === errorData.imageSize ? null : (
                          <strong className="font-bold text-red-500">{diffPixelList[index]}</strong>
                        )}
                      </>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <>
                      {diffPixelList[index] === errorData.imageSize ? null : (
                        <Button
                          label="保存"
                          handleClick={handleClick}
                          className="px-4 py-1"
                        ></Button>
                      )}
                    </>
                  </td>
                </>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
