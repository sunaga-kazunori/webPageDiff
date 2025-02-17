import React from 'react';

type Props = {
  sourceUrlList: string[];
  targetUrlList: string[];
};

const Table: React.FC<Props> = ({ sourceUrlList, targetUrlList }) => {
  const maxLength = Math.max(sourceUrlList.length, targetUrlList.length);

  return (
    <div className="p-4">
      <table className="table-auto w-full border-collapse border border-gray-300 w-ull">
        <colgroup>
          <col className="w-[10%]" />
          <col className="w-[45%]" />
          <col className="w-[45%]" />
        </colgroup>
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">No</th>
            <th className="border border-gray-300 px-4 py-2">Source URL</th>
            <th className="border border-gray-300 px-4 py-2">Target URL</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxLength }).map((_, index) => (
            <tr key={crypto.randomUUID()} className="odd:bg-gray-100 even:bg-white">
              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">{sourceUrlList[index] || ''}</td>
              <td className="border border-gray-300 px-4 py-2">{targetUrlList[index] || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
