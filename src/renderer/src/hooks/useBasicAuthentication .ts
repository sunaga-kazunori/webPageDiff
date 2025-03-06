import { useEffect, useState } from 'react';

type UseBasicAuthentication = {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
};

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
