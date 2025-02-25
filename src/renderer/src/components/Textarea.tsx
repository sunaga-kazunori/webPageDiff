import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';

type Props = {
  label: string;
  urlList: string[];
  setUrlText: Dispatch<SetStateAction<string>>;
  isReset: boolean;
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUrlError: React.Dispatch<React.SetStateAction<boolean>>;
};

const Textarea: React.FC<Props> = ({
  label,
  urlList,
  setUrlText,
  isReset,
  setIsReset,
  setIsUrlError
}) => {
  const handleChange = (event: ChangeEvent): void => {
    if (!(event.target instanceof HTMLTextAreaElement)) {
      throw new TypeError();
    }

    setUrlText(event.target.value);
    setIsReset(false);
  };

  const handleBlur = (): void => {
    for (const url of urlList) {
      if (!URL.canParse(url)) {
        setIsUrlError(true);

        return;
      }
    }

    setIsUrlError(false);
  };

  return (
    <label className="flex flex-col">
      {label}
      <textarea
        className="border border-black"
        onChange={handleChange}
        onBlur={handleBlur}
        {...(isReset ? { value: '' } : {})}
      ></textarea>
    </label>
  );
};

export default Textarea;
