import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { validateForDiffCheck } from '../../utilities/validateForDiffCheck';

describe('validateForDiffCheck', () => {
  const errorMessages = {
    offline: 'You are offline',
    invalidViewPortSize: 'Invalid viewport size',
    empty: 'Both URL lists are empty',
    mismatch: 'Source and target URL lists are not the same length',
    invalidValue: 'One or more URLs are invalid'
  };

  let navigatorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    navigatorSpy = vi.spyOn(window.navigator, 'onLine', 'get');
  });

  afterEach(() => {
    navigatorSpy.mockRestore();
  });

  test('オフラインの場合、エラーメッセージが表示される', () => {
    navigatorSpy.mockReturnValue(false);

    const result = validateForDiffCheck([], [], 800, errorMessages);
    expect(result).toEqual({
      isValid: false,
      errorMessage: errorMessages.offline
    });
  });

  test('ビューポートサイズが無効な場合、エラーメッセージが表示される', () => {
    const result = validateForDiffCheck([], [], 150, errorMessages);
    expect(result).toEqual({
      isValid: false,
      errorMessage: errorMessages.invalidViewPortSize
    });
  });

  test('Source URLとTarget URLどちらも入力されていない場合、エラーメッセージが表示される', () => {
    const result = validateForDiffCheck([], [], 800, errorMessages);
    expect(result).toEqual({
      isValid: false,
      errorMessage: errorMessages.empty
    });
  });

  test('Source URLとTarget URLでURLの個数が違う場合、エラーメッセージが表示される', () => {
    const result = validateForDiffCheck(['https://example.com'], [], 800, errorMessages);
    expect(result).toEqual({
      isValid: false,
      errorMessage: errorMessages.mismatch
    });
  });

  test('無効なURLが含まれている場合、エラーメッセージが表示される', () => {
    const invalidUrl = 'invalid-url';
    const result = validateForDiffCheck([invalidUrl], ['https://example.com'], 800, errorMessages);
    expect(result).toEqual({
      isValid: false,
      errorMessage: errorMessages.invalidValue
    });
  });

  test('すべての条件が有効な場合、エラーメッセージは表示されない', () => {
    const result = validateForDiffCheck(
      ['https://example.com'],
      ['https://example.com'],
      800,
      errorMessages
    );
    expect(result).toEqual({
      isValid: true,
      errorMessage: null
    });
  });
});
