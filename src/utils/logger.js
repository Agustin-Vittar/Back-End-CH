import winston from "winston";

export const loggerDev = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "debug", // debug => verbose => http => info => warn => error
      format: winston.format.colorize({ all: true }),
    }),
  ],
});

const loggerProd = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "info", // info => warn => error
      format: winston.format.colorize({ all: true }),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "error", // error
      format: winston.format.simple(),
    }),
  ],
});

export const addLogger = (req, res, next) => {
  if (process.argv[2] === "PROD") {
    req.logger = loggerProd;
  } else {
    // Dev
    req.logger = loggerDev;
  }

  next();
};
