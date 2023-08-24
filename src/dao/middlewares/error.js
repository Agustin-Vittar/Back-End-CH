import EErrors from "../../services/errors/enums.js";

export default (error, req, res, next) => {
  loggerDev.error(error.cause);

  switch (error.code) {
    // ERROR 1
    case EErrors.ROUTING_ERROR:
      res
        .status(404)
        .send({ status: "Error", error: error.name, cause: error.cause });
      break;
    // ERROR 2
    case EErrors.INVALID_TYPES_ERROR:
      res
        .status(400)
        .send({ status: "Error", error: error.name, cause: error.cause });
      break;
    // ERROR 3
    case EErrors.DATABASES_READ_ERROR:
      res
        .status(500)
        .send({ status: "Error", error: error.name, cause: error.cause });
      break;
    // ERROR 4
    case EErrors.DATABASES_CONNECTION_ERROR:
      res
        .status(500)
        .send({ status: "Error", error: error.name, cause: error.cause });
      break;
    // ERROR 5
    case EErrors.PRODUCT_CREATION_ERROR:
      res
        .status(400)
        .send({ status: "Error", error: error.name, cause: error.cause });
      break;
    default:
      res.status(500).send({ status: "Error", error: "Unhandled error" });
      break;
  }
};
