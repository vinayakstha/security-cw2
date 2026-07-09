import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import {
  loginLimiter,
  registerLimiter,
  passwordResetRequestLimiter,
  passwordResetLimiter,
} from "../middleware/rateLimiter.middleware";

let authController = new AuthController();
const router = Router();

router.post("/register", registerLimiter, authController.register);
router.post("/login", loginLimiter, authController.login);

router.post(
  "/request-password-reset",
  passwordResetRequestLimiter,
  authController.sendResetPasswordEmail,
);
router.post(
  "/reset-password/:token",
  passwordResetLimiter,
  authController.resetPassword,
);

export default router;
