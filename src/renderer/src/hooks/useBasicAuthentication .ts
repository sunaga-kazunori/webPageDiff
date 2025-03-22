import { useEffect, useState } from 'react';

type UseBasicAuthentication = {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Basic認証の状態を管理するカスタムフック
 *
 * @returns {UseBasicAuthentication} ユーザー名、パスワード、チェックが入っているか、及びそれらの状態更新関数を含むオブジェクト
 */
export const useBasicAuthentication = (): UseBasicAuthentication => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (!isChecked) {
      setUsername('');
      setPassword('');
    }
  }, [isChecked]);

  return {
    username,
    setUsername,
    password,
    setPassword,
    isChecked,
    setIsChecked
  };
};
