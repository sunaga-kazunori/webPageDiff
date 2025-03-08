import { useEffect, useState } from 'react';

type UseReset = {
  reset: () => void;
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>;
};

export const useReset = (_reset): UseReset => {
  const [isReset, setIsReset] = useState(false);

  const reset = (): void => {
    setIsReset(true);
    _reset();
  };

  useEffect(() => {
    if (isReset) {
      setIsReset(false);
    }
  }, [isReset]);

  return { reset, setIsReset };
};
