const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "tmp/" });
const {
  signup,
  validateForSignup,
  login,
  logout,
  getProfile,
  update,
  validateForUpdate,
  updateAvatar,
  verifyToken,
  validateForVerify,
  verifyEmail,
} = require("../../controllers/users");
const { catchErrors } = require("../../utils/catchErrors");
const userMiddleware = require("../../middlewares/user");

const router = express.Router();

router.post("/register", validateForSignup(), catchErrors(signup));
router.get("/login", validateForSignup(), catchErrors(login));
router.post("/logout", userMiddleware, catchErrors(logout));
router.get("/current", userMiddleware, catchErrors(getProfile));
router.patch("/", [userMiddleware, validateForUpdate()], catchErrors(update));

router.patch(
  "/avatars",
  [userMiddleware, upload.single("avatar")],
  catchErrors(updateAvatar)
);

router.get("/verify/:verificationToken", catchErrors(verifyToken));
router.post("/verify", validateForVerify(), catchErrors(verifyEmail));

module.exports = router;
