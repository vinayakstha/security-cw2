import { Router } from "express";
import { TotpController } from "../controllers/totp.controller";
import { authorizedMiddleware } from "../middleware/authorization.middleware";
import { totpLoginLimiter } from "../middleware/rateLimiter.middleware";

let totpController = new TotpController();
const router = Router();

// Authenticated routes (for managing TOTP settings)
router.post("/setup", authorizedMiddleware, totpController.setup);
router.post("/verify-enable", authorizedMiddleware, totpController.verifyAndEnable);
router.post("/disable", authorizedMiddleware, totpController.disable);

// Public routes (for login flow)
router.post("/login-verify", totpLoginLimiter, totpController.loginVerify);

export default router;
