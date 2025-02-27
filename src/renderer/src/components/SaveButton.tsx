import React from 'react';

type Props = {
  label: string;
  handleClick: () => void;
};

const SaveButton: React.FC<Props> = ({ label, handleClick }) => {
  return (
    <button type="button" onClick={handleClick}>
      {label}
    </button>
  );
};

export default SaveButton;
