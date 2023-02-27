import { Logger } from 'traceability';

export const getEmptyValues = (environment: Object): string[] => {
  const hasEmptyValues: string[] = [];

  if (environment) {
    Object.entries(environment).forEach(([key, value]) => {
      if (key && !value) hasEmptyValues.push(key);
    });
  }

  return hasEmptyValues;
};

export const limitMaxStringLength = (
  string: string,
  maxLength: number,
): string => {
  try {
    const smallerString = string.slice(0, maxLength);
    const isSmallerThenMaxLength = string.length > maxLength;
    return `${smallerString}${isSmallerThenMaxLength ? '...' : ''}`;
  } catch (error: any) {
    Logger.error(error.message, {
      eventName: 'limitMaxStringLength',
      eventData: {
        string,
        maxLength,
      },
    });
    throw error;
  }
};

export const decreaseAttributesLengthFromObject = (
  object: any,
  maxLength: number = 35,
): Object => {
  if (typeof object !== 'object') {
    return object;
  }

  let objectTransformed: any = {};
  Object.keys(object).forEach((key) => {
    objectTransformed[key] =
      typeof object[key] == 'string'
        ? limitMaxStringLength(object[key], maxLength)
        : object[key];
  });

  return objectTransformed;
};
