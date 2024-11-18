/* eslint-disable @typescript-eslint/no-explicit-any */

// Type Definitions
declare global {
  interface Window {
    _loog: number;
  }
}

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

interface ConsoleStyle {
  fontSize?: string;
  background?: string;
  color?: string;
  padding?: string;
  border?: string;
  margin?: string;
  fontWeight?: string;
}

interface LogConfig {
  enabled: boolean;
  level: LogLevel;
  showTimestamp: boolean;
}

interface LogUtils {
  log: (...args: any[]) => void;
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  success: (...args: any[]) => void;
  table: (data: any) => void;
  time: (label: string) => void;
  timeEnd: (label: string) => void;
  group: (label: string, ...args: any[]) => void;
  groupEnd: () => void;
  clear: () => void;
  trace: (...args: any[]) => void;
  setConfig: (config: Partial<LogConfig>) => void;
  getConfig: () => LogConfig;
}

// Constants
const DEFAULT_CONFIG: LogConfig = {
  enabled: false,
  level: 'debug',
  showTimestamp: true,
};

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  success: 4,
};

const STYLE_CONFIG: Record<LogLevel, ConsoleStyle> = {
  debug: {
    fontSize: '13px',
    background: '#e8f4f8',
    color: '#6c757d',
    padding: '2px 6px',
    border: '1px solid #6c757d',
  },
  info: {
    fontSize: '13px',
    background: '#e3f2fd',
    color: '#2196f3',
    padding: '2px 6px',
    border: '1px solid #2196f3',
  },
  warn: {
    fontSize: '13px',
    background: '#fff3e0',
    color: '#ff9800',
    padding: '2px 6px',
    border: '1px solid #ff9800',
    fontWeight: 'bold',
  },
  error: {
    fontSize: '13px',
    background: '#ffebee',
    color: '#f44336',
    padding: '2px 6px',
    border: '1px solid #f44336',
    fontWeight: 'bold',
  },
  success: {
    fontSize: '13px',
    background: '#e8f5e9',
    color: '#4caf50',
    padding: '2px 6px',
    border: '1px solid #4caf50',
  },
};

// Utility Functions
const styleToString = (style: ConsoleStyle): string => {
  return Object.entries(style)
    .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`)
    .join('; ');
};

const getTimestamp = (): string => new Date().toISOString().split('T')[1].split('.')[0];

// Logger Implementation
const createLogger = (): LogUtils => {
  let config: LogConfig = { ...DEFAULT_CONFIG };

  const shouldLog = (level: LogLevel): boolean => {
    const isDev = import.meta.env.DEV;
    const enable = isDev || window._loog === 1;
    return enable || (config.enabled && LOG_LEVELS[level] >= LOG_LEVELS[config.level]);
  };

  const createLoggerForLevel =
    (level: LogLevel) =>
    (...args: any[]): void => {
      if (!shouldLog(level)) return;
      const style = STYLE_CONFIG[level];
      const timestamp = config.showTimestamp ? getTimestamp() : '';
      const prefix = timestamp
        ? `[${level.toUpperCase()}] ${timestamp}`
        : `[${level.toUpperCase()}]`;
      console.log(`%c ${prefix}`, styleToString(style), ...args);
    };

  // Create base logging functions
  const logger: LogUtils = {
    setConfig: (newConfig: Partial<LogConfig>): void => {
      config = { ...config, ...newConfig };
    },

    getConfig: (): LogConfig => ({ ...config }),

    log: (...rest: any[]): void => {
      if (!shouldLog('info')) return;
      console.log('%c [ LOG ]', 'font-size:13px; background:pink; color:#bf2c9f;', ...rest);
    },

    debug: createLoggerForLevel('debug'),
    info: createLoggerForLevel('info'),
    warn: createLoggerForLevel('warn'),
    error: createLoggerForLevel('error'),
    success: createLoggerForLevel('success'),

    table: (data: any): void => {
      if (!shouldLog('info')) return;
      console.log('%c [ TABLE ]', 'font-size:13px; color:#2196f3;');
      console.table(data);
    },

    time: (label: string): void => {
      if (!shouldLog('debug')) return;
      console.time(`🕒 ${label}`);
    },

    timeEnd: (label: string): void => {
      if (!shouldLog('debug')) return;
      console.timeEnd(`🕒 ${label}`);
    },

    group: (label: string, ...args: any[]): void => {
      if (!shouldLog('info')) return;
      console.group(`📂 ${label}`, ...args);
    },

    groupEnd: (): void => {
      if (!shouldLog('info')) return;
      console.groupEnd();
    },

    clear: (): void => {
      console.clear();
    },

    trace: (...args: any[]): void => {
      if (!shouldLog('debug')) return;
      console.log('%c [ TRACE ]', 'font-size:13px; color:#9c27b0;');
      console.trace(...args);
    },
  };

  return logger;
};

const Logger = createLogger();
export default Logger;
