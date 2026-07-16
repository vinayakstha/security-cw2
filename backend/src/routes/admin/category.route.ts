import { Router } from "express";
import {
  adminOnlyMiddleware,
  authorizedMiddleware,
} from "../../middleware/authorization.middleware";
import { uploads, validateFileMagicBytes } from "../../middleware/upload.middleware";
import { AdminCategoryController } from "../../controllers/admin/category.controller";

let categoryController = new AdminCategoryController();
const router = Router();

router.use(authorizedMiddleware);
router.use(adminOnlyMiddleware);
router.post(
  "/",
  uploads.single("categoryImage"),
  validateFileMagicBytes,
  categoryController.createCategory,
);
router.put(
  "/:id",
  uploads.single("categoryImage"),
  validateFileMagicBytes,
  categoryController.updateCategory,
);

router.get("/", categoryController.getAllCategories);
router.delete("/:id", categoryController.deleteCategory);
router.get("/:id", categoryController.getCategoryById);

export default router;
