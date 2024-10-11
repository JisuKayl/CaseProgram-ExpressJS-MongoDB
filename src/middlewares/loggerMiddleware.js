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

      // Check if user information is available
      if (req.fullName && req.userRole) {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          infoLogger.info(
            `User: ${req.fullName}, Role: ${req.userRole} - Request: ${logDetails.method} ${logDetails.url} - Response Status: ${logDetails.status} message: ${logDetails.success}`
          );
        } else {
          errorLogger.error(
            `User: ${req.fullName}, Role: ${req.userRole} - Request: ${logDetails.method} ${logDetails.url} - Response Status: ${logDetails.status} message: ${logDetails.error}`
          );
        }
      } else {
        // Log without user information
        if (res.statusCode >= 200 && res.statusCode < 400) {
          infoLogger.info(
            `Request: ${logDetails.method} ${logDetails.url} - Response Status: ${logDetails.status} message: ${logDetails.success}`
          );
        } else {
          errorLogger.error(
            `Request: ${logDetails.method} ${logDetails.url} - Response Status: ${logDetails.status} message: ${logDetails.error}`
          );
        }
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
