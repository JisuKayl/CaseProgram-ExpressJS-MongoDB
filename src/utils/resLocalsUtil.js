const setSuccessMessage = (res, message) => {
  res.locals.successMessage = message;
};

const setErrorMessage = (res, message) => {
  res.locals.errorMessage = message;
};

const getSuccessMessage = (res) => res.locals.successMessage || null;

const getErrorMessage = (res) => res.locals.errorMessage || null;

module.exports = {
  setSuccessMessage,
  setErrorMessage,
  getSuccessMessage,
  getErrorMessage,
};
