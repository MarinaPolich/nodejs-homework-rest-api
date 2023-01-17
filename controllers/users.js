const fs = require("fs").promises;
const Jimp = require("jimp");
const {
  addUser,
  findByEmail,
  findById,
  updateUser,
  findByVerificationTokenAndSetVerify,
} = require("../servises/users");
const { hashPassword, comparePassword } = require("../utils/password");
const { validator } = require("../utils/validator");
const { signupSchema, updateSchema, verifySchema } = require("./schema/users");
const { generateToken } = require("../utils/token");
const gravatar = require("gravatar");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function validateForSignup() {
  return validator(signupSchema);
}

function validateForUpdate() {
  return validator(updateSchema);
}

function validateForVerify() {
  return validator(verifySchema, "missing required field email");
}

const signup = async (req, res) => {
  const user = req.body;
  user.avatarURL = gravatar.url(user.email, { protocol: "http" });

  user.password = await hashPassword(user.password);

  try {
    const { email, subscription, avatarURL, verificationToken } = await addUser(
      user
    );

    const msg = {
      to: email,
      from: "polich.igor@ukr.net",
      subject: "Verification Token",
      text: `/users/verify/${verificationToken}`,
      html: `<a href="http://localhost:3000/users/verify/${verificationToken}">/users/verify/${verificationToken}</a>`,
    };

    await sgMail.send(msg);

    res.status(201).json({ user: { email, subscription, avatarURL } }).end();
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

  if (passwordMatches && user.verify) {
    const token = await generateToken({ id: user._id });
    updateUser(user._id, { token });
    res
      .status(200)
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

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path } = req.file;
  const file = await Jimp.read(path);
  file.cover(250, 250).write(`public/avatars/${_id}`);
  await fs.unlink(path);
  const { avatarURL } = await updateUser(_id, {
    avatarURL: `/avatars/${_id}`,
  });

  res.json({ avatarURL }).end();
};

const verifyToken = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await findByVerificationTokenAndSetVerify(verificationToken);

  if (user) {
    res
      .status(200)
      .json({
        message: "Verification successful",
      })
      .end();
    return;
  }
  res
    .status(404)
    .json({
      message: "User not found",
    })
    .end();
};

const verifyEmail = async (req, res) => {
  const { email, verify, verificationToken } = await findByEmail(
    req.body.email
  );
  if (email !== req.body.email) {
    res
      .status(401)
      .json({
        message: "Email or password is wrong",
      })
      .end();
    return;
  }
  if (!verify) {
    const msg = {
      to: email,
      from: "polich.igor@ukr.net",
      subject: "Verification Token",
      text: `/users/verify/${verificationToken}`,
      html: `<a href="http://localhost:3000/users/verify/${verificationToken}">/users/verify/${verificationToken}</a>`,
    };

    await sgMail.send(msg);

    res
      .status(200)
      .json({
        message: "Verification email sent",
      })
      .end();
    return;
  }

  res
    .status(400)
    .json({
      message: "Verification has already been passed",
    })
    .end();
};

module.exports = {
  signup,
  login,
  validateForSignup,
  getProfile,
  logout,
  update,
  validateForUpdate,
  updateAvatar,
  verifyToken,
  validateForVerify,
  verifyEmail,
};
