import { Router } from "express";
import {
  authorizedMiddleware,
  adminOnlyMiddleware,
} from "../../middleware/authorization.middleware";
import { AdminBookingController } from "../../controllers/admin/booking.controller";

const router = Router();
const bookingController = new AdminBookingController();

router.use(authorizedMiddleware);
router.use(adminOnlyMiddleware);

router.get("/", bookingController.getAllBookings);
router.put("/:id/status", bookingController.updateBookingStatus);
router.get("/:id", bookingController.getBookingById);

export default router;
