/**
 * A very simple logger including local time, level, message and object
 * Can be easily customized to support more advanced loggers.
 * 
/**
 * A very simple logger including local time, level, message and object
 * Can be easily customized to support more advanced loggers.
 * 
 * Use:
 * ~~~
 *  import { logger, LogLevel } from '@mazito/logger';
 * 
 *  // set up the level in startup code (hooks)
 *  logger.level(LogLevel.DEBUG);
 * 
 *  // simple log with message
 *  logger.debug("This is a debug message");
 * 
 *  // log with message and structured object
 *  logger.info("This is an info message with object", { ev: ev, data: data })
 * ~~~
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerInstance, LogLevel } from './src/logger.ts';

export {
  logger,
  LogLevel
}

// the logger Singleton
let logger: LoggerInstance | null = null;
if (!logger) logger = new LoggerInstance();
