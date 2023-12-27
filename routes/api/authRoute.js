const express = require("express");

const { authMiddleware } = require("../../middlewares");
const { authController } = require("../../controllers");

const router = express.Router();

router.post(
  "/register",
  authMiddleware.checkRegisterData,
  authController.register
);
router.post("/login", authMiddleware.checkLoginData, authController.login);

router.use(authMiddleware.protect);

router.get("/current", authController.currentUser);
router.post("/logout", authController.logout);

module.exports = router;
