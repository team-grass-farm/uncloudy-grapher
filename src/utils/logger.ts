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

type CallbackFn = <T extends Message>(
  moduleName: string,
  message: T,
  option?: Option<T>
) => void;

interface Report
  extends Record<
    'debug' | 'info' | 'log' | 'warn' | 'error' | 'assert',
    CallbackFn
  > {}

const isNone = (val: any): boolean => {
  if (Array.isArray(val)) {
    return val.length === 0;
  } else if (typeof val === 'object') {
    return Object.entries(val as Object).every(([_, val]) => val === null);
  } else {
    return !!!val;
  }
};

export const report = [
  'debug',
  'info',
  'log',
  'warn',
  'error',
  'assert',
].reduce<Report | {}>(
  (acc, logLevel) => ({
    ...acc,
    [logLevel]: ((moduleName, message, option) => {
      if (!!option?.listening && option.listening.every(isNone)) return;
      !LOGGER_BLACKLIST.some((b) => moduleName === b) &&
        console[logLevel](
          '%c ' + moduleName + ' %c',
          'margin-left: -0.5rem; background: ' +
            (option?.tagColor ?? '#999999aa') +
            '; color: white',
          'background: unset; color: unset',
          message
        );
    }) as CallbackFn,
  }),
  {}
) as Report;
