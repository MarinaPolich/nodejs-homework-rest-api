const validator = (schema, message) => (req, res, next) => {
  const body = req.body;
  console.log("body", body);
  const validation = schema.validate(body);

  if (validation.error) {
    res.status(400).json(message ? { message } : validation.error);
    return;
  }

  return next();
};

module.exports = {
  validator,
};
