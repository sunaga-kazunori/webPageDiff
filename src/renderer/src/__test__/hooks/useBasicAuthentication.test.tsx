import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useBasicAuthentication } from '../../hooks/useBasicAuthentication ';

describe('useBasicAuthentication', () => {
  it('初期状態ではusername, passwordが空文字列で、isCheckedはfalseである', () => {
    const { result } = renderHook(() => useBasicAuthentication());

    expect(result.current.username).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.isChecked).toBe(false);
  });

  it('usernameとpasswordが設定される', () => {
    const { result } = renderHook(() => useBasicAuthentication());

    act(() => {
      result.current.setUsername('test_user');
    });
    expect(result.current.username).toBe('test_user');
    act(() => {
      result.current.setPassword('password123');
    });
    expect(result.current.password).toBe('password123');
  });

  it('isCheckedがfalseの場合、usernameとpasswordはリセットされる', () => {
    const { result } = renderHook(() => useBasicAuthentication());

    act(() => {
      result.current.setIsChecked(true);
      result.current.setUsername('test_user');
      result.current.setPassword('password123');
    });

    expect(result.current.isChecked).toBe(true);
    expect(result.current.username).toBe('test_user');
    expect(result.current.password).toBe('password123');

    act(() => {
      result.current.setIsChecked(false);
    });

    expect(result.current.isChecked).toBe(false);
    expect(result.current.username).toBe('');
    expect(result.current.password).toBe('');
  });

  it('isCheckedがtrueの場合、usernameとpasswordは保持される', () => {
    const { result } = renderHook(() => useBasicAuthentication());

    act(() => {
      result.current.setIsChecked(true);
      result.current.setUsername('test_user');
      result.current.setPassword('password123');
    });

    expect(result.current.isChecked).toBe(true);
    expect(result.current.username).toBe('test_user');
    expect(result.current.password).toBe('password123');
  });
});
