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
      <span className="font-bold">{label}</span>
      <textarea
        className="border border-gray-400 h-40 rounded-sm mt-1 p-1"
        onChange={handleChange}
        {...(isReset ? { value: '' } : {})}
      ></textarea>
    </label>
  );
};

export default Textarea;
