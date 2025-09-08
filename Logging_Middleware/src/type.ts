export type LogStack = 'backend' | 'frontend';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export type LogPackage =
  | 'cache'
  | 'controller'
  | 'cron_job'
  | 'db'
  | 'domain'
  | 'handler'
  | 'response'
  | 'router';

