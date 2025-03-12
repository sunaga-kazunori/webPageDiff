import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import CheckboxToggle from '../../components/CheckboxToggle';

const TestComponent: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <CheckboxToggle label="チェックボックス" isChecked={isChecked} setIsChecked={setIsChecked}>
      <div>入れ子になっているコンテンツ</div>
    </CheckboxToggle>
  );
};

describe('CheckboxToggle', () => {
  it('初期状態では入れ子になっているコンテンツが表示されていない', () => {
    render(<TestComponent />);
    expect(screen.queryByText('入れ子になっているコンテンツ')).toBeNull();
  });

  it('チェック状態に応じて入れ子になっているコンテンツが表示される', () => {
    render(<TestComponent />);
    const checkbox = screen.getByRole('checkbox');

    expect(screen.queryByText('入れ子になっているコンテンツ')).toBeNull();
    fireEvent.click(checkbox);
    expect(screen.getByText('入れ子になっているコンテンツ')).toBeInTheDocument();
  });
});
