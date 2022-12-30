import { LOGGER_BLACKLIST } from '~constants';

/**
 * @module logger
 */
interface Message extends Object {
  msg: string;
  [s: string]: any;
}
interface Option<T> {
  tagColor?: string;
  listening?: (keyof T)[];
}

type CallbackFn<T = Message> = (
  moduleName: string,
  message: T,
  option?: Option<T>
) => void;

interface Report
  extends Record<
    'debug' | 'info' | 'log' | 'warn' | 'error' | 'assert',
    CallbackFn
  > {
  group: CallbackFn<string>;
  groupCollapsed: CallbackFn<string>;
  groupEnd: () => void;
}

const isNone = (val: any): boolean => {
  if (Array.isArray(val)) {
    return val.length === 0;
  } else if (val === null) {
    return true;
  } else if (typeof val === 'object') {
    return Object.entries(val as Object).every(([_, val]) => val === null);
  } else {
    return !!!val;
  }
};

const isValid = (val: any): boolean => {
  if (Array.isArray(val)) {
    return val.length > 0;
  } else if (typeof val === 'object') {
    return !Object.entries(val as Object).every(([_, val]) => val === null);
  } else {
    return !!val;
  }
};

export const report = [
  'debug',
  'info',
  'log',
  'warn',
  'error',
  'assert',
  'group',
  'groupCollapsed',
  'groupEnd',
].reduce<Report | {}>(
  (acc, logLevel) => ({
    ...acc,
    [logLevel]: ((moduleName, message, option) => {
      if (logLevel === 'groupEnd') {
        console[logLevel]();
      } else if (!!option?.listening?.every((val) => isNone(message[val]))) {
      } else {
        !LOGGER_BLACKLIST.some((b) => moduleName === b) &&
          console[logLevel](
            '%c ' + moduleName + ' %c',
            'background: ' +
              (option?.tagColor ?? '#999999aa') +
              '; color: white; font-weight: normal;',
            'background: unset; color: unset',
            message
          );
      }
    }) as CallbackFn,
  }),
  {}
) as Report;
