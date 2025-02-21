import React from 'react';

type Props = {
  children: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

const Button: React.FC<Props> = ({ children, onClick, disabled = false, className = '' }) => {
  return (
    <div className="mt-5">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 ${className}`}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
