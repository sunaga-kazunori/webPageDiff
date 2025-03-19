import React, { Dispatch, SetStateAction } from 'react';

type Props = {
  label: string;
  type: string;
  setText: Dispatch<SetStateAction<string>>;
  value: string;
};

const BasicAuthenticationInput: React.FC<Props> = ({ label, type, setText, value }) => {
  const handleChange = (event: React.FocusEvent<HTMLInputElement>): void => {
    setText(event.target.value);
  };

  return (
    <label className="flex flex-col mt-2">
      {label}
      <input
        type={type}
        value={value}
        onChange={handleChange}
        className="border border-gray-400 rounded-sm mt-1 p-1"
      ></input>
    </label>
  );
};

export default BasicAuthenticationInput;
