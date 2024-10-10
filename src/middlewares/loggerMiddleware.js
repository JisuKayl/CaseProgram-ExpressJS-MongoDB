const { infoLogger, errorLogger } = require("../config/logger");

const loggerMiddleware = (req, res, next) => {
  const skipRoutes = ["/login"];

  if (skipRoutes.includes(req.path)) {
    return next();
  }

  const requestDetails = {
    method: req.method,
    url: req.url,
  };

  res.on("finish", () => {
    const logDetails = {
      ...requestDetails,
      status: res.statusCode,
    };
    if (res.statusCode >= 200 && res.statusCode < 400) {
      infoLogger.info(
        `Request: ${logDetails.method} ${logDetails.url} - Response Status: ${logDetails.status}`
      );
    } else {
      errorLogger.error(
        `Request: ${logDetails.method} ${logDetails.url} - Response Status: ${logDetails.status}`
      );
    }
  });

  next();
};

module.exports = loggerMiddleware;
