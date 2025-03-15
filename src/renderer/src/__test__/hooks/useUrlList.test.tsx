import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useUrlList } from '../../hooks/useUrlList';

describe('useUrlListカスタムフックのテスト', () => {
  it('URLリストが正しくセットされる', () => {
    const { result } = renderHook(() => useUrlList());

    expect(result.current.urlText).toBe('');
    expect(result.current.urlList).toEqual([]);

    act(() => {
      result.current.setUrlText('https://example.com\nhttps://test.com');
    });

    expect(result.current.urlText).toBe('https://example.com\nhttps://test.com');
    expect(result.current.urlList).toEqual(['https://example.com', 'https://test.com']);
  });

  it('空行が除去されてURLリストが生成される', () => {
    const { result } = renderHook(() => useUrlList());

    act(() => {
      result.current.setUrlText('https://example.com\n\nhttps://test.com');
    });

    expect(result.current.urlList).toEqual(['https://example.com', 'https://test.com']);
  });

  it('URLリストが空の場合、空配列が返される', () => {
    const { result } = renderHook(() => useUrlList());

    act(() => {
      result.current.setUrlText('');
    });

    expect(result.current.urlList).toEqual([]);
  });
});
