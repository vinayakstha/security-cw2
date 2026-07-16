import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authorizedMiddleware } from "../middleware/authorization.middleware";
import { uploads, validateFileMagicBytes } from "../middleware/upload.middleware";

let userController = new UserController();
const router = Router();

router.put(
  "/update-profile",
  authorizedMiddleware,
  uploads.single("profilePicture"),
  validateFileMagicBytes,
  userController.updateProfile,
);

router.get("/me", authorizedMiddleware, userController.getCurrentUser);
router.get("/:id", authorizedMiddleware, userController.getUserById);

export default router;
