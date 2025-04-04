import React, { Dispatch, ReactNode, SetStateAction, useId } from 'react';

type Props = {
  label: string;
  children: ReactNode;
  isChecked: boolean;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
};

const CheckboxToggle: React.FC<Props> = ({ label, children, isChecked, setIsChecked }) => {
  const id = useId();
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setIsChecked(event.target.checked);
  };

  return (
    <div className="mt-4">
      <label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="mr-1"
          aria-expanded={isChecked}
          aria-controls={id}
        />
        <span className="font-bold">{label}</span>
      </label>

      {isChecked && (
        <div className="mt-2" id={id}>
          {children}
        </div>
      )}
    </div>
  );
};
export default CheckboxToggle;
