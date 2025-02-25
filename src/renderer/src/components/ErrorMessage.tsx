import React from 'react';

type Props = {
  message: string;
};

const ErrorMessage: React.FC<Props> = ({ message }) => {
  return (
    <div role="alert" aria-live="polite">
      <strong>{message}</strong>
    </div>
  );
};

export default ErrorMessage;
