import React from 'react';

type Props = {
  children: string;
  handleClick: () => void;
  disabled?: boolean;
  className?: string;
};

const Button: React.FC<Props> = ({ children, handleClick, disabled = false, className = '' }) => {
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
