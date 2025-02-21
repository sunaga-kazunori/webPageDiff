import React from 'react';

type Props = {
  sourceUrlList: string[];
  targetUrlList: string[];
  diffPixelList: string[];
  diffImageList: string[];
};

// TODO: コンポーネント分割
const Table: React.FC<Props> = ({ sourceUrlList, targetUrlList, diffPixelList, diffImageList }) => {
  const maxLength = Math.max(sourceUrlList.length, targetUrlList.length);

  return (
    <div className="p-4">
      <table className="table-auto w-full border-collapse border border-gray-300">
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
            <th className="border border-gray-300 px-4 py-2">No</th>
            <th className="border border-gray-300 px-4 py-2">Source URL</th>
            <th className="border border-gray-300 px-4 py-2">Target URL</th>
            {diffPixelList.length !== 0 && (
              <>
                <th className="border border-gray-300 px-4 py-2">差分量</th>
                <th className="border border-gray-300 px-4 py-2">差分画像</th>
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
                <td className="border border-gray-300 px-4 py-2">{sourceUrl}</td>
                <td className="border border-gray-300 px-4 py-2">{targetUrl}</td>
                {diffPixelList.length !== 0 && (
                  <>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {`${diffPixelList[index]}px` || ''}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button type="button" onClick={handleClick}>
                        保存
                      </button>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
