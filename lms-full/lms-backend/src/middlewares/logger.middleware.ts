import pino from "pino";
import pinoHttp from "pino-http";

export const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
    },
  },
});

export const httpLogger = pinoHttp({
  logger,

  customLogLevel(req, res, err) {
    if (res.statusCode >= 500 || err) {
      return "error";
    }

    if (res.statusCode >= 400) {
      return "warn";
    }

    return "info";
  },

  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
      };
    },

    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
});
