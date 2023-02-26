import { Logger, LoggerTraceability } from 'traceability';
import { loggerConfiguration } from './../../log/logger.conf';
import { Writable } from 'stream';
import winston from 'winston';

const mockDate = new Date(1466424490000);
jest.spyOn(global, 'Date').mockImplementation((): any => mockDate);

const gettingLoggerForTest = () => {
  let output: string[] = [];
  const stream = new Writable();
  stream._write = (chunk, encoding, next) => {
    output.push(chunk.toString());
    next();
  };
  const streamTransport = new winston.transports.Stream({ stream });
  const configDefault = LoggerTraceability.getLoggerOptions();
  configDefault.transports = [streamTransport];
  LoggerTraceability.configure(configDefault);

  return { output, streamTransport };
};

describe('loggerConfiguration', () => {
  let outputData: string[];

  beforeEach(() => {
    const { output } = gettingLoggerForTest();
    outputData = output;
  });

  it('should use a default configuration logger', async () => {
    Logger.info('teste');
    expect(outputData).toHaveLength(1);
    expect(outputData.toString()).toEqual(
      `{\"level\":\"info\",\"message\":\"teste\",\"timestamp\":\"2016-06-20T12:08:10.000Z\"}
`,
    );
  });
  it('must check the pattern when use the loggerConfiguration from qd pacakge', async () => {
    const { output, streamTransport } = gettingLoggerForTest();
    loggerConfiguration.transports = [streamTransport];
    LoggerTraceability.configure(loggerConfiguration);

    Logger.info('Ola mundo');
    expect(output).toHaveLength(1);
    expect(JSON.stringify(output)).toEqual(
      '["\\u001b[32m2016-06-20T12:08:10.000Z - info:\\u001b[39m Ola mundo  \\n"]',
    );
  });
});
