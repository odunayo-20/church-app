const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
} as const;

type LogLevel = keyof typeof LOG_LEVELS;

const ENV = process.env.NODE_ENV;
const MIN_LEVEL: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) ||
  (ENV === "production" ? "warn" : "debug");

function formatMessage(
  level: LogLevel,
  message: string,
  data?: unknown,
): string {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  const dataStr = data ? ` ${JSON.stringify(data)}` : "";
  return `${prefix} ${message}${dataStr}`;
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LEVEL];
}

export const logger = {
  debug(message: string, data?: unknown) {
    if (!shouldLog("debug")) return;
    console.debug(formatMessage("debug", message, data));
  },

  info(message: string, data?: unknown) {
    if (!shouldLog("info")) return;
    console.log(formatMessage("info", message, data));
  },

  warn(message: string, data?: unknown) {
    if (!shouldLog("warn")) return;
    console.warn(formatMessage("warn", message, data));
  },

  error(message: string, error?: unknown) {
    if (!shouldLog("error")) return;
    console.error(formatMessage("error", message, error));

    if (ENV === "production" && typeof window === "undefined") {
      console.error(
        formatMessage("error", "Production error report", {
          message,
          error:
            error instanceof Error
              ? { name: error.name, message: error.message, stack: error.stack }
              : error,
          timestamp: new Date().toISOString(),
        }),
      );
    }
  },
};

export function withErrorLog<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  context: string,
) {
  return async (...args: T): Promise<R | undefined> => {
    try {
      return await fn(...args);
    } catch (error) {
      logger.error(`Error in ${context}`, error);
      return undefined;
    }
  };
}
