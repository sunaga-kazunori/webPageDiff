import { useEffect, useState } from 'react';

type UseReset = {
  reset: () => void;
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * リセット機能を管理するカスタムフック
 *
 * @param _reset リセットを実行する関数。
 * @returns {UseReset} リセット関数とリセット状態の更新関数を含むオブジェクト
 */
export const useReset = (_reset: VoidFunction): UseReset => {
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
