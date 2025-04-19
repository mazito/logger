/**
 * A very simple logger including local time, level, message and object
 * Can be easily customized to support more advanced loggers.
 * 
 * Use:
 * ~~~
 *  import { logger, LogLevel } from '$lib/utils/logger';
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

export {
  LogLevel,
  LoggerInstance
}

enum LogLevel {
  DEBUG = 1, 
  INFO = 2, 
  WARN = 3, 
  ERROR = 4, 
  FATAL = 5,
  TIMER = 6 // additional Level that displays over every level
}

const LogLevelCodes = {
  1: 'DBG',
  2: 'INF',
  3: 'WRN',
  4: 'ERR',
  5: 'FTL',
  6: 'DTS'
};


class LoggerInstance {
  _level = LogLevel.INFO;
  _lastTs: any = null;
  _elapsed: any = null;
  _timer: boolean = false;
  _prefix: string = '';
  _contexts: string[] = [];

  level(v?: LogLevel) {
    if (!v || (this._level === v)) return this;
    this._level = v;
    const lvlcode = LogLevelCodes[v];
    this.info(`Logger level set to '${lvlcode}'`)
    return this;
  }

  context(s?: string) {
    if (s === undefined) { 
      // pop context
      this._contexts.pop();
      const top = this._contexts.length;
      this._prefix = top ? this._contexts[top-1] : ''; 
      return this 
    };
    this._contexts.push(s);
    this._prefix = s;
    return this;
  }

  debug(message: string, obj?: any) {
    logIt(this, LogLevel.DEBUG, message, obj);
    return this;
  }  

  info(message: string, obj?: any) {
    logIt(this, LogLevel.INFO, message, obj);
    return this;
  }  

  warn(message: string, obj?: any) {
    logIt(this, LogLevel.WARN, message, obj);
    return this;
  }  

  error(message: string, obj?: any) {
    logIt(this, LogLevel.ERROR, message, obj);
    return this;
  }  

  fatal(message: string, obj?: any) {
    logIt(this, LogLevel.FATAL, message, obj);
    return this;
  }  

  /** Enable the timer and reset to zero */
  timer(message?: string, obj?: any) {
    this._lastTs = Date.now();
    this._elapsed = 0.0; // secs
    this._timer = (message?.toUpperCase() !== 'OFF');
    if (this._timer && message) logIt(this, LogLevel.TIMER, `${message}`, obj);
    return this;
  }

  /** Display the time elapsed since last call to this function */
  elapsed(message: string, obj?: any) {
    logIt(this, LogLevel.TIMER, `${message || ''}`, obj);
    return this;
  }
}

// HELPERS /////////////////////////////////////////////////////////////////////

function elapsedTs(_this: LoggerInstance): string {
  if (!_this._lastTs) _this._lastTs = Date.now();
  const ts = Date.now();
  _this._elapsed = (ts - _this._lastTs)/1000.0; // secs
  return `(${_this._elapsed.toFixed(3)}s)`;
}

function logIt(_this: LoggerInstance, lvl: LogLevel, message: string, obj?: any) {
  let lvlcode = LogLevelCodes[lvl];
  if (lvl < _this._level) return; 
  message = _this._prefix ? `${_this._prefix} ${message}` : message;
  message = _this._timer ? `${elapsedTs(_this)} ${message}` : message;
  const smsg = `${getISOTimeString()} ${lvlcode} ${message || ''}`;
  if (!obj) { console.log(smsg) } else { console.log(smsg, obj) };
}

function getISOTimeString() {
  const now = new Date();
  const ye = now.getFullYear();
  const mo = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const dy = String(now.getDate()).padStart(2, '0');
  const hr = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');
  const se = String(now.getSeconds()).padStart(2, '0');
  const ms = String(now.getMilliseconds()).padStart(3, '0');
  // Combine into ISO format
  return `${ye}-${mo}-${dy} ${hr}:${mi}:${se}.${ms}`;
}
