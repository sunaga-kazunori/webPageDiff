import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import BasicAuthenticationInput from '../../components/BasicAuthenticationInput';

describe('BasicAuthenticationInput', () => {
  it('入力が行われた時、setText が正しく呼び出される', () => {
    const setTextMock = vi.fn();
    render(
      <BasicAuthenticationInput label="ユーザー名" value="" setText={setTextMock} type="text" />
    );

    const inputElement = screen.getByRole('textbox');

    fireEvent.change(inputElement, { target: { value: 'newUsername' } });

    expect(setTextMock).toHaveBeenCalledTimes(1);
    expect(setTextMock).toHaveBeenCalledWith('newUsername');
  });

  it('入力された値が value に反映される', () => {
    const ParentComponent: React.FC = () => {
      const [text, setText] = useState('');

      return (
        <BasicAuthenticationInput label="ユーザー名" value={text} setText={setText} type="text" />
      );
    };

    render(<ParentComponent />);

    const inputElement = screen.getByRole<HTMLInputElement>('textbox');

    expect(inputElement.value).toBe('');
    fireEvent.change(inputElement, { target: { value: 'newUser' } });
    expect(inputElement.value).toBe('newUser');
  });
});
