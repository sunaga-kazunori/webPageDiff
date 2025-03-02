type ErrorMessages = {
  [key: string]: string;
};

type ValidationResult = {
  isValid: boolean;
  errorMessage: string | null;
};

export const validateForDiffCheck = (
  sourceUrlList: string[],
  targetUrlList: string[],
  viewPortSize: number,
  errorMessages: ErrorMessages
): ValidationResult => {
  if (!window.navigator.onLine) {
    return { isValid: false, errorMessage: errorMessages.offline };
  }

  if (viewPortSize < 200 || viewPortSize > 10000) {
    return { isValid: false, errorMessage: errorMessages.invalidViewPortSize };
  }

  if (sourceUrlList.length === 0 && targetUrlList.length === 0) {
    return { isValid: false, errorMessage: errorMessages.empty };
  }

  if (sourceUrlList.length !== targetUrlList.length) {
    return { isValid: false, errorMessage: errorMessages.mismatch };
  }

  const isValid = [...sourceUrlList, ...targetUrlList].every((url) => URL.canParse(url));
  if (!isValid) {
    return { isValid: false, errorMessage: errorMessages.invalidValue };
  }

  return { isValid: true, errorMessage: null };
};
