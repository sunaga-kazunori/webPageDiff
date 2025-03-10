import React from 'react';

type Props = {
  diffPixelList: (string | number)[];
};

const ErrorMessage: React.FC<Props> = ({ diffPixelList }) => {
  return (
    <div className="flex flex-col gap-1">
      {diffPixelList.map((item, index) => {
        if (item === 'error: Images Sizes') {
          return (
            <strong key={crypto.randomUUID()} className="text-red-500 flex mt-1">
              <span className="shrink-0">No{index + 1}：</span>
              <span>
                差分の確認を行うことができませんでした。大量の差分が発生している可能性があるためページをご確認ください。
              </span>
            </strong>
          );
        }
        return null;
      })}
    </div>
  );
};

export default ErrorMessage;
