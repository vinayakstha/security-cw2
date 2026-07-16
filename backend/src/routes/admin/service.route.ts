import { Router } from "express";
import {
  adminOnlyMiddleware,
  authorizedMiddleware,
} from "../../middleware/authorization.middleware";
import { uploads, validateFileMagicBytes } from "../../middleware/upload.middleware";
import { AdminServiceController } from "../../controllers/admin/service.controller";

let serviceController = new AdminServiceController();
const router = Router();

router.use(authorizedMiddleware);
router.use(adminOnlyMiddleware);

router.post(
  "/",
  uploads.single("serviceImage"),
  validateFileMagicBytes,
  serviceController.createService,
);

router.put(
  "/:id",
  uploads.single("serviceImage"),
  validateFileMagicBytes,
  serviceController.updateService,
);

router.get("/", serviceController.getAllServices);

router.get("/category/:categoryId", serviceController.getServicesByCategory);

router.get("/:id", serviceController.getServiceById);

router.delete("/:id", serviceController.deleteService);

export default router;
