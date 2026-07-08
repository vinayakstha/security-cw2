import { Router } from "express";
import { AdminUserController } from "../../controllers/admin/user.controller";
import {
  adminOnlyMiddleware,
  authorizedMiddleware,
} from "../../middleware/authorization.middleware";
import { uploads } from "../../middleware/upload.middleware";

const router = Router();
const adminUserController = new AdminUserController();

router.use(authorizedMiddleware);
router.use(adminOnlyMiddleware);

router.post(
  "/",
  uploads.single("profilePicture"),
  adminUserController.createUser,
);
router.get("/", adminUserController.getAllUsers);
router.get("/:id", adminUserController.getUserById);
router.put(
  "/:id",
  uploads.single("profilePicture"),
  adminUserController.updateUser,
);
router.delete("/:id", adminUserController.deleteUser);

export default router;
