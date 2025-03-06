import React from 'react';

type Props = {
  label: string;
};

const LoadingSpinner: React.FC<Props> = ({ label }) => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1] text-white flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
      <div>{label}</div>
    </div>
  );
};

export default LoadingSpinner;
