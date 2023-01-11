const {
  addUser,
  findByEmail,
  findById,
  updateUser,
} = require("../servises/users");
const { hashPassword, comparePassword } = require("../utils/password");
const { validator } = require("../utils/validator");
const { signupSchema, updateSchema } = require("./scema/users");
const { generateToken, verifyToken } = require("../utils/token");

function validateForSignup() {
  return validator(signupSchema);
}

function validateForUpdate() {
  return validator(updateSchema);
}

const signup = async (req, res) => {
  const user = req.body;

  user.password = await hashPassword(user.password);

  try {
    const { email, subscription } = await addUser(user);
    res.status(201).json({ user: { email, subscription } }).end();
  } catch (err) {
    if (err.code === 11000) {
      res
        .status(409)
        .json({
          message: "Email in use",
        })
        .end();
    } else {
      throw err;
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findByEmail(email);

  const passwordMatches = await comparePassword(password, user.password);

  if (passwordMatches) {
    const token = await generateToken({ id: user._id });
    updateUser(user._id, { token });
    res
      .json({
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
          id: user._id,
        },
      })
      .end();
  } else {
    res
      .status(401)
      .json({
        message: "Email or password is wrong",
      })
      .end();
  }
};

const getProfile = async (req, res) => {
  const { _id } = req.user;

  const { email, subscription } = await findById(_id);

  res.json({ email, subscription }).end();
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await updateUser(_id, { token: "" });
  res.status(204).end();
};

const update = async (req, res) => {
  const { email, subscription } = await updateUser(req.user._id, {
    subscription: req.body.subscription,
  });
  res.json({ email, subscription }).end();
};

module.exports = {
  signup,
  login,
  validateForSignup,
  getProfile,
  logout,
  update,
  validateForUpdate,
};
