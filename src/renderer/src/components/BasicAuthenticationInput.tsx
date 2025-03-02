import React, { Dispatch, SetStateAction } from 'react';

type Props = {
  label: string;
  setText: Dispatch<SetStateAction<string>>;
  isChecked: boolean;
  value: string;
};

const BasicAuthenticationInput: React.FC<Props> = ({ label, setText, value }) => {
  const handleChange = (event: React.FocusEvent<HTMLInputElement>): void => {
    setText(event.target.value);
  };

  return (
    <label className="flex flex-col">
      {label}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className="border border-black"
      ></input>
    </label>
  );
};

export default BasicAuthenticationInput;
