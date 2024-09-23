const userFullName = () => {
  return { $concat: ["$firstName", " ", "$lastName"] };
};

module.exports = userFullName;
