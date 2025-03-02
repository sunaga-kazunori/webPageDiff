import React, { Dispatch, ReactNode, SetStateAction } from 'react';

type Props = {
  label: string;
  children: ReactNode;
  isChecked: boolean;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
};

const CheckboxToggle: React.FC<Props> = ({ label, children, isChecked, setIsChecked }) => {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setIsChecked(event.target.checked);
  };

  return (
    <div>
      <label>
        <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
        {label}
      </label>

      {isChecked && children}
    </div>
  );
};
export default CheckboxToggle;
