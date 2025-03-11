import React from 'react';

type Props = {
  index: number;
  message: string;
};

const ErrorItem: React.FC<Props> = ({ index, message }) => (
  <strong className="text-red-500 flex mt-1">
    <span className="shrink-0">No{index + 1}：</span>
    <span>{message}</span>
  </strong>
);

export default ErrorItem;
