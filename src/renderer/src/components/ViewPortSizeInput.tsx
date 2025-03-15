import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';

type Props = {
  label: string;
  viewPortSize: number;
  setViewPortSize: Dispatch<SetStateAction<number>>;
};

const ViewPortSizeInput: React.FC<Props> = ({ label, viewPortSize, setViewPortSize }) => {
  const handleChange = (event: ChangeEvent): void => {
    if (!(event.target instanceof HTMLInputElement)) {
      throw new TypeError();
    }

    const value = event.target.value;
    if (value === '') {
      setViewPortSize(0);
    } else {
      setViewPortSize(Number(value));
    }
  };

  return (
    <label className="flex flex-col">
      <span className="font-bold">{label}</span>
      <span className="flex items-center">
        <input
          type="number"
          className="border border-gray-400 rounded-sm mr-1 mt-1 p-1"
          onChange={handleChange}
          value={viewPortSize === 0 ? '' : viewPortSize}
          min="200"
          max="10000"
        ></input>
        <span>px</span>
      </span>
    </label>
  );
};

export default ViewPortSizeInput;
