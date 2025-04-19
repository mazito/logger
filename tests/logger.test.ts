import { expect, test, describe } from 'bun:test';
import { logger, LogLevel } from '../index.ts';

describe("Settings", () => {
  test("The 'logger' singleton is available", () => {
    expect(logger).not.toBeNull();
  });

  test("Default level is INFO", () => {
    logger.debug("This debug message must NOT be visible");
    expect(logger._level).toBe(LogLevel.INFO);
  });

  test("Change level to DEBUG", () => {
    logger.level(LogLevel.DEBUG);
    logger.debug("This debug message must be visible");
    expect(logger._level).toBe(LogLevel.DEBUG);
  });
});

describe("Logging", () => {
  test("logger.debug()", () => {
    logger.debug("This DEBUG message must be visible");
  });

  test("logger.debug() with optional object", () => {
    logger.debug("This DEBUG message must be visible. obj=", {
      name: 'example-object',
      props: [],
    });
  });

  test("logger.info()", () => {
    logger.info("This INFO message must be visible");
  });

  test("logger.warn()", () => {
    logger.warn("This WARN message must be visible");
  });

  test("logger.error()", () => {
    try {
      throw new Error("Some error");
    }
    catch(error: any) {
      logger.error("ERROR message with error object=", {
        message: error.message, stack: error.stack
      });
    }
  });

  test("logger.fatal()", () => {
    try {
      throw new Error("A really ugly error");
    }
    catch(error: any) {
      logger.fatal("FATAL message with error object=", {
        message: error.message, stack: error.stack
      });
    }
  });
});

describe("Timing", () => {
  test("Reset timer", () => {
    logger.timer("Timer to zero");
    logger.elapsed("No time elapsed");
    expect(logger._elapsed).toBeLessThan(0.01);
  });

  test("Elapsed time", async () => {
    await delay(1000);
    logger.elapsed("Delayed for 1000ms");
    expect(logger._elapsed).toBeGreaterThanOrEqual(1.0);
  });

  test("Enable timer on/off", async () => {
    logger.timer('Enabled')
    logger.info('Timer was enabled');
    await delay(1000);
    logger.elapsed("Delayed for 1000ms");
    expect(logger._elapsed).toBeGreaterThanOrEqual(1.0);
    logger.timer('off')
    logger.info('Timer was disabled');
    await delay(1000);
    logger.elapsed("Delayed for 1000ms");
    expect(logger._elapsed).toBeLessThanOrEqual(0);
  });
});

describe("Chaining", () => {
  test("Chain some functions", async () => {
    logger
      .level(LogLevel.INFO)
      .context("[logger test chaining]")
      .timer("Timer reset")
      .info("Some INFO message here")
      .debug("Some debug obj with delay", {
        delayed: await delay(1000)
      })
      .warn("Be careful with long delays !!!")
      .info("End of the chain !")
      .elapsed("Tooked some time");
    expect(logger._elapsed).toBeGreaterThanOrEqual(1.0);
  });
});

describe("Context", () => {
  test("Push and pop contexts", async () => {
    logger
      .level(LogLevel.DEBUG)
      .context("[context 1 chaining]")
      .timer("Timer reset")
      .info("Some INFO message here")
      .context("[context 2 long delays]")
      .debug("Some debug obj with delay", {
        delayed: await delay(1000)
      })
      .warn("Be careful with long delays !!!")
      .context()
      .info("End of the chain !")
      .elapsed("Tooked some time");
    expect(logger._elapsed).toBeGreaterThanOrEqual(1.0);
  });
});

// HELPERS /////////////////////////////////////////////////////////////////////

// Delay function
function delay(ms: any) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
