import { Logger } from 'traceability';
import { promisify } from 'node:util';
import process from 'node:process';
import gitconfig from 'gitconfiglocal';

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

export const gitRemoteOriginUrl = async () => {
  const pGitconfig = promisify(gitconfig);
  const cwd = process.cwd();
  const remoteName = 'origin';
  const config = await pGitconfig(cwd);
  const url =
    config.remote && config.remote[remoteName] && config.remote[remoteName].url;

  if (!url) {
    throw new Error(`Couldn't find ${remoteName} url`);
  }

  return url;
};
