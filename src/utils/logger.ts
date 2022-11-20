import { LOGGER_BLACKLIST } from '~constants';

/**
 * @module logger
 */
type CallbackFn = (moduleName: string, message: any[], color?: string) => void;
type Report = Record<
  'debug' | 'info' | 'log' | 'warn' | 'error' | 'assert',
  CallbackFn
>;

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
    [logLevel]: ((moduleName, message, color = '#999999aa') => {
      !LOGGER_BLACKLIST.some((b) => moduleName === b) &&
        console[logLevel](
          '%c ' + moduleName + ' %c',
          'margin-left: -0.5rem; background: ' + color + '; color: white',
          'background: unset; color: unset',
          ...message
        );
    }) as CallbackFn,
  }),
  {}
) as Report;
