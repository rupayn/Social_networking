import morgan from "morgan";
import { logger, configureLogger } from "./logger.ts";
const morganFormat = ":method :url :status :response-time ms";
// Custom format for console logging with colors
const myLog = morgan(morganFormat, {
  stream: {
    write: (message) => {
      const logObject = {
        method: message.split(" ")[0],
        url: message.split(" ")[1],
        status: message.split(" ")[2],
        responseTime: message.split(" ")[3],
      };
      logger.info(JSON.stringify(logObject));
    },
  },
});

export { myLog, logger, configureLogger };
