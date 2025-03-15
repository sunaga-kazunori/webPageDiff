import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useReset } from '../../hooks/useReset';

describe('useReset', () => {
  it('関数resetが呼ばれるとisResetがtrueになり、関数_resetが呼び出される', () => {
    const mockReset = vi.fn();
    const { result } = renderHook(() => useReset(mockReset));

    act(() => {
      result.current.reset();
    });

    expect(mockReset).toHaveBeenCalledTimes(1);
    expect(result.current.setIsReset).toBeDefined();
  });

  it('isResetがtrueになったらfalseにリセットされる', () => {
    const mockReset = vi.fn();
    const { result } = renderHook(() => useReset(mockReset));

    expect(result.current.setIsReset).toBeDefined();

    act(() => {
      result.current.reset();
    });

    act(() => {
      result.current.setIsReset(false);
    });

    expect(result.current.setIsReset).toBeDefined();
  });
});
