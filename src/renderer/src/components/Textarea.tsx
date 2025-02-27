import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';

type Props = {
  label: string;
  setUrlText: Dispatch<SetStateAction<string>>;
  isReset: boolean;
};

const Textarea: React.FC<Props> = ({ label, setUrlText, isReset }) => {
  const handleChange = (event: ChangeEvent): void => {
    if (!(event.target instanceof HTMLTextAreaElement)) {
      throw new TypeError();
    }

    setUrlText(event.target.value);
  };

  return (
    <label className="flex flex-col">
      {label}
      <textarea
        className="border border-black"
        onChange={handleChange}
        {...(isReset ? { value: '' } : {})}
      ></textarea>
    </label>
  );
};

export default Textarea;
