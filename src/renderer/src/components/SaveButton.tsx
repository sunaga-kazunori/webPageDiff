import React from 'react';

type Props = {
  label: string;
  handleClick: () => void;
};

const SaveButton: React.FC<Props> = ({ label, handleClick }) => {
  return (
    <button
      type="button"
      onClick={handleClick}
      className="px-4 py-1 text-white bg-blue-500 rounded hover:bg-blue-600 cursor-pointer font-bold"
    >
      {label}
    </button>
  );
};

export default SaveButton;
