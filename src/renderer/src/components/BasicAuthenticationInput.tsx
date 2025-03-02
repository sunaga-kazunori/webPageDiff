import React, { Dispatch, SetStateAction } from 'react';

type Props = {
  label: string;
  setText: Dispatch<SetStateAction<string>>;
  isReset: boolean;
};

const BasicAuthenticationInput: React.FC<Props> = ({ label, setText, isReset }) => {
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
    setText(event.target.value);
  };

  return (
    <label className="flex flex-col">
      {label}
      <input
        type="text"
        {...(isReset ? { value: '' } : {})}
        onBlur={handleBlur}
        className="border border-black"
      ></input>
    </label>
  );
};

export default BasicAuthenticationInput;
