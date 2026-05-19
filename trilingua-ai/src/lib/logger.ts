type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  [key: string]: unknown;
}

function createLogEntry(
  level: LogLevel,
  message: string,
  meta?: Record<string, unknown>
): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };
}

export const logger = {
  debug(message: string, meta?: Record<string, unknown>) {
    if (process.env.NODE_ENV === "development") {
      console.debug(JSON.stringify(createLogEntry("debug", message, meta)));
    }
  },

  info(message: string, meta?: Record<string, unknown>) {
    console.info(JSON.stringify(createLogEntry("info", message, meta)));
  },

  warn(message: string, meta?: Record<string, unknown>) {
    console.warn(JSON.stringify(createLogEntry("warn", message, meta)));
  },

  error(message: string, error?: unknown, meta?: Record<string, unknown>) {
    const errorMeta: Record<string, unknown> = { ...meta };
    if (error instanceof Error) {
      errorMeta.errorName = error.name;
      errorMeta.errorMessage = error.message;
      // Never log stack traces in production to avoid leaking paths
      if (process.env.NODE_ENV === "development") {
        errorMeta.stack = error.stack;
      }
    }
    console.error(JSON.stringify(createLogEntry("error", message, errorMeta)));
  },
};
