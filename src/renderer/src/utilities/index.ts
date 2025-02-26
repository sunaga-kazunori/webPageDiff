export const convertArray = (text: string): string[] =>
  text.split('\n').filter((url) => url.trim() !== '');
