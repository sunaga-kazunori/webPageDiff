import React, { Dispatch, SetStateAction } from 'react';
import BasicAuthenticationInput from './BasicAuthenticationInput';
import CheckboxToggle from './CheckboxToggle';
import Textarea from './Textarea';

type Props = {
  urlState: {
    urlText: string;
    setUrlText: Dispatch<SetStateAction<string>>;
  };
  basicAuthenticationState: {
    isChecked: boolean;
    setIsChecked: Dispatch<SetStateAction<boolean>>;
    username: string;
    setUsername: Dispatch<SetStateAction<string>>;
    password: string;
    setPassword: Dispatch<SetStateAction<string>>;
  };
  label: string;
};

const UrlInput: React.FC<Props> = ({ urlState, basicAuthenticationState, label }) => {
  return (
    <>
      <Textarea label={label} urlText={urlState.urlText} setUrlText={urlState.setUrlText} />
      <CheckboxToggle
        label="Basic認証"
        isChecked={basicAuthenticationState.isChecked}
        setIsChecked={basicAuthenticationState.setIsChecked}
      >
        <BasicAuthenticationInput
          label="ユーザー名"
          type="text"
          setText={basicAuthenticationState.setUsername}
          value={basicAuthenticationState.username}
        />
        <BasicAuthenticationInput
          label="パスワード"
          type="password"
          setText={basicAuthenticationState.setPassword}
          value={basicAuthenticationState.password}
        />
      </CheckboxToggle>
    </>
  );
};

export default UrlInput;
