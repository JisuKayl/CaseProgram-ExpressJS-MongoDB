const { infoLogger, errorLogger } = require("../config/logger");
const {
  getSuccessMessage,
  getErrorMessage,
} = require("../utils/resLocalsUtil");

const loggerMiddleware = (req, res, next) => {
  try {
    const skipRoutes = [];

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
        success: getSuccessMessage(res),
        error: getErrorMessage(res),
      };
      if (res.statusCode >= 200 && res.statusCode < 400) {
        infoLogger.info(
          `Request: ${logDetails.method} ${logDetails.url} - Response Status: ${logDetails.status} message: ${logDetails.success}`
        );
      } else {
        errorLogger.error(
          `Request: ${logDetails.method} ${logDetails.url} - Response Status: ${logDetails.status} message: ${logDetails.error}`
        );
      }
    });

    next();
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

module.exports = loggerMiddleware;
