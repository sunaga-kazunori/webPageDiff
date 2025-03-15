import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Textarea from '../../components/Textarea';

describe('Textareaコンポーネントのテスト', () => {
  it('初期値がテキストエリアに反映される', () => {
    const setUrlText = vi.fn();

    render(<Textarea label="URL" urlText="https://example.com" setUrlText={setUrlText} />);
    expect(screen.getByRole('textbox')).toHaveValue('https://example.com');
  });

  it('テキストエリアに入力を行った場合、setUrlTextが呼び出される', () => {
    const setUrlText = vi.fn();

    render(<Textarea label="URL" urlText="" setUrlText={setUrlText} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'https://test.com' } });
    expect(setUrlText).toHaveBeenCalledWith('https://test.com');
  });
});
