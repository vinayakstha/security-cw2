import { Router } from "express";
import { authorizedMiddleware } from "../middleware/authorization.middleware";
import { CategoryController } from "../controllers/category.controller";

let categoryController = new CategoryController();
const router = Router();

router.get("/", authorizedMiddleware, categoryController.getAllCategories);
router.get("/:id", authorizedMiddleware, categoryController.getCategoryById);

export default router;
