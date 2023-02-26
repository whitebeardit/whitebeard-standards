import { logLevel } from 'kafkajs';
import { Logger } from 'traceability';

export const toWinstonLogLevel = (level: number): string => {
  switch (level) {
    case logLevel.ERROR:
    case logLevel.NOTHING:
      return 'error';
    case logLevel.WARN:
      return 'warn';
    case logLevel.INFO:
      return 'info';
    case logLevel.DEBUG:
      return 'debug';
    default:
      return 'debug';
  }
};

export const createLoggerKafkaJs = () => {
  return ({ level, log }: any) => {
    const { message, groupId, ...extra } = log;
    Logger.log({
      level: toWinstonLogLevel(level),
      message: `Kafka: ${message} ${groupId}`,
      extra,
    });
  };
};
