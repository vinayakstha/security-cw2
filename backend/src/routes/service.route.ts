import { Router } from "express";
import { authorizedMiddleware } from "../middleware/authorization.middleware";
import { UserServiceController } from "../controllers/service.controller";

let serviceController = new UserServiceController();
const router = Router();

router.use(authorizedMiddleware);

router.get("/", serviceController.getAllServices);

router.get("/category/:categoryId", serviceController.getServicesByCategory);

router.get("/:id", serviceController.getServiceById);

export default router;
