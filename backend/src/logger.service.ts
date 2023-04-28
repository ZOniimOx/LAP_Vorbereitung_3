import { Logger, LoggerOptions, transports } from "winston";
import * as winston from "winston";

// const logLevel = process.env.LOG_DEFAULT_LEVEL + '';
const appName: string = "Webshop";
const env = "dev";

const options: LoggerOptions = {
  exitOnError: false,
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),

  defaultMeta: {
    app: appName,
    env: env,
    version: "1.0.0",
    module: "backend",
  },
  transports: [
    new transports.Console({ format: winston.format.cli() }),
    // new transports.Http(
    //   {
    //     level: logLevel,
    //     host: process.env.LOG_SERVER,
    //     port: parseInt(process.env.LOG_PORT || '0', 10),
    //   }
    // ),
  ],
};

export class LoggerService {
  logger: Logger = winston.createLogger(options);
}

export default new LoggerService().logger;
