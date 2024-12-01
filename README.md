# Logger

A very simple logger that can easily ran in the Browser, Node, Bun and possibly 
in Deno.

**Why ?**

Most loggers have been designed to work on Node, and latter extended to run in 
the browser, but require some configuration to do so, or do not display info 
in the format I needed/wanted.

I wanted a logger featuring:

- Browser first, using but not replacing `console`. 
- No configuration required, just `import { logger } ... ` and start logging.
- Easily switch DEBUG level on/off, in some particular module/function. 
- Calculate elapsed time between calls, easier to use than the `console` timer 
  functions.
- Simplified and cleaner API with just the most used methods.
- Usable in the browser, Node and others without changes/reconfiguration.
- Easy to include other loggers, in case I needed to. 
- Simple but effective format: `ISOlocaltime` `level` `message` and optional
 `obj`. This minimum set is enough most of the time. 

**Installation**

Just use NPM:
~~~
npm install @mazito/logger
~~~

or 
~~~
pnpm add @mazito/logger
~~~

**Usage**

At App initialization.
~~~
  import { logger, LogLevel } from '@mazito/logger';

  // set up the level in startup code (hooks)
  logger.level(LogLevel.DEBUG);
~~~

In source code (elsewhere):
~~~
  // simple debug log with message
  logger.debug("This is a debug message");

  // log info with message and structured object
  logger.info("This is an info message with object", { 
    ev: someEv, 
    data: someData 
  })
~~~

Example outputs:
~~~
2024-11-28 11:23:05.661 INF Started App
2024-11-28 11:23:05.661 DTS (0.000s) Started client hooks timer
2024-11-28 11:23:05.661 INF Restoring globals
2024-11-28 11:23:05.661 INF Restored User profile {uid: '0102030405060708', companyName: 'Pampa Energía', siteName: 'Planta Zárate', fullName: 'Mariza Belocopi Suarez', email: 'mariza@pampaeneriga.com', …}
2024-11-28 11:23:05.661 INF Restored User preferences {darkMode: false, samplesView: {…}}
2024-11-28 11:23:05.662 DTS (0.001s) Done client hooks initialize
~~~

**DISCLAIMER** 

This is a personal project, and I will not claim it is best or 
better than any other available logger out there. It is a just logger I feel 
confortable using in my own projects, so feel free to use it, modify it or 
just ignore it.

**Other loggers** I have used or find interesting, and may latter integrate
to it or use are:

- [Pino](https://github.com/pinojs/pino), together with 
[pino-pretty](https://github.com/pinojs/pino-pretty): Have used this in some
Node projects and works quite well. Had some troubles with making it also work 
in the browser the way I wanted (surely my fault !).

- [LogTape](https://logtape.org/): Have not used it but looks quite good too, 
and also simple to use and configure. Will give it a try when I have some time.

- [Winston](https://github.com/winstonjs/winston): Have not used it. Seems quite
complete, but looked like too much for simple logging tasks or small projects.

And there are a lot of other good loggers available. Just search :-)

## Singleton

We only have **one(1) and only one instance of the Logger**, and it is 
the global `logger` var.

This instance is created and initialized the first time the logger module is 
imported, usually at App startup:
~~~javascript
import { logger, LogLevel } from '@mazito/logger';

// set up the logger level
logger.level(LogLevel.DEBUG);

// we can start logging now !!!
logger.info("App started and logging");
~~~

## Log levels

### logger.level(v: LogLevel)

Set the logger level after which messages will be logged, where: 
~~~
enum LogLevel {
  DEBUG = 1, 
  INFO = 2, 
  WARN = 3, 
  ERROR = 4, 
  FATAL = 5 
}
~~~
The default level is INFO.

**NOTE**: the logger level can be setup in any module/function before starting 
logs for that module/function and can be reset to a different level after the 
module/function finishes.

In this way we can set `LogLevel.DEBUG` for some part of the code 
and resume to `LogLevel.INFO` after that.

## Logging

These methods log messages in accordance with the allowed logger level, and are
 the usual log functions available everywhere:
- `logger.debug(message: string, obj?: any)`
- `logger.info(message: string, obj?: any)`
- `logger.warn(message: string, obj?: any)`
- `logger.error(message: string, obj?: any)`
- `logger.fatal(message: string, obj?: any)`

**Params**

All of the methods take two params:
- A required `message` string that will be always displayed in the log.
- An _optional_ `obj` object that can be passed to the log, in case we need
 additional info in the log.

**Format**

The log line will always include:
- The `local time`in ISO format. Example `2024-11-28 11:23:05.661`.
- The `level` of the message. It will be `DBG` for debug() calls, `INF` for
 info() calls, `WRN` for warn() calls, `ERR` for error() calls and `FTL` for
 fatal() calls. For timing calls it will be `DTS`.
- The `message` text
- The option `obj` object if it is available.

There are **no other format options available !**

**Example outputs**

With `message` only:
~~~
2024-11-28 11:23:05.661 INF Restoring globals
~~~

With `message` and optional `obj`:
~~~
2024-11-28 11:23:05.661 INF Restored User profile {uid: '0102030405060708', companyName: 'Pampa Energía', siteName: 'Planta Zárate', fullName: 'Mariza Belocopi Suarez', email: 'mariza@pampaeneriga.com', …}
~~~


## Timing 

These functions provide ways to measure (and log) elapsed time since the timer reset,
and are useful for measuring running times of parts of the code.

They are **only available in DEBUG level**. 

#### logger.timer(message: string, obj?: any)

Resets the logger timer to zero so we can use `elapsed()` to show time elapsed since
this moment and the next elapsed call.

Example output:
~~~
2024-11-28 11:23:05.661 DTS (0.000s) Started client hooks timer
~~~

#### logger.elapsed(message: string, obj?: any)

Shows the time elapsed since the `timer()` reset and this call. 

Example output:
~~~
2024-11-28 11:23:05.662 DTS (0.020s) Done client hooks initialize
~~~

## Errors

Displaying errors can be done in many different ways. 

We can  just pass the Error instance to `logger.error()`:

~~~javascript
try {
  // Code that might throw an error
  throw new Error("Something went wrong!");
} catch (error) {
  logger.error("Error in module XXX", error);
}
~~~



We can fully disect the Error instance and pass it as an object:

~~~javascript
try {
  // Code that might throw an error
  throw new Error("Something went wrong!");
} catch (error) {
  // Full exception info
  logger.error("Error in module XXX", {
    name: error.name, // The name of the error
    message: error.message, // The error message
    stack: error.stack // The stack trace
  }); 
}
~~~



We can use a custom error object if not an Error instance:

~~~javascript
try {
  // Throwing a custom non-Error object
  throw { code: 500, description: "Received a server error" };
} catch (error) {
  if (error instanceof Error) 
    logger.error("Error in module XXX", {
      name: error.name, // The name of the error
      message: error.message, // The error message
      stack: error.stack // The stack trace
    })
  else
    logger.error("Custom Exception in module XXX", error)
  ;
}
~~~



We can also send the Error instance and some additional info:

~~~javascript
try {
  // Code that might throw an error
  throw new Error("Something went wrong!");
} catch (error) {
  // Full exception info
  logger.error("Error in module XXX", {
    error: error, // the received Error or Custom exception instance
    data: {...} // some added data or context given by the app 
    // any other props or objects we may want to include ...
  }); 
}
~~~

