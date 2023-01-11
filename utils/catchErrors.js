const catchErrors = (action) => (req, res, next) =>
  action(req, res).catch((e) => {
    console.error(e);
    next(e);
  });

module.exports = {
  catchErrors,
};
