const express = require("express");
const {
  signup,
  validateForSignup,
  login,
  logout,
  getProfile,
  update,
  validateForUpdate,
} = require("../../controllers/users");
const { catchErrors } = require("../../utils/catchErrors");
const userMiddleware = require("../../middlewares/user");

const router = express.Router();

router.post("/register", validateForSignup(), catchErrors(signup));
router.get("/login", validateForSignup(), catchErrors(login));
router.post("/logout", userMiddleware, catchErrors(logout));
router.get("/current", userMiddleware, catchErrors(getProfile));
router.patch("/", [userMiddleware, validateForUpdate()], catchErrors(update));

module.exports = router;
