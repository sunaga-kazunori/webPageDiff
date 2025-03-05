'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  label: string;
  handleClick: () => void;
  className?: string;
};

const baseStyle = 'px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 cursor-pointer';

const Button: React.FC<Props> = ({ label, handleClick, className = '' }) => {
  return (
    <button onClick={handleClick} className={twMerge(baseStyle, className)}>
      {label}
    </button>
  );
};

export default Button;
