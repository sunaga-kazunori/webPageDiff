import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ViewPortSizeInput from '../../components/ViewPortSizeInput';

describe('ViewPortSizeInput', () => {
  it('ビューポートサイズが入力されるとsetViewPortSizeが呼び出される', () => {
    const setViewPortSize = vi.fn();
    render(
      <ViewPortSizeInput
        label="ビューポートサイズ"
        viewPortSize={0}
        setViewPortSize={setViewPortSize}
      />
    );

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '1024' } });
    expect(setViewPortSize).toHaveBeenCalledWith(1024);
  });

  it('ビューポートサイズが空欄の場合、setViewPortSizeに0がセットされる', () => {
    const setViewPortSize = vi.fn();
    render(
      <ViewPortSizeInput
        label="ビューポートサイズ"
        viewPortSize={1024}
        setViewPortSize={setViewPortSize}
      />
    );

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '' } });
    expect(setViewPortSize).toHaveBeenCalledWith(0);
  });
});
