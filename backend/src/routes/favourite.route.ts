import { Router } from "express";
import { authorizedMiddleware } from "../middleware/authorization.middleware";
import { UserFavouriteController } from "../controllers/favourite.controller";

const router = Router();
const favouriteController = new UserFavouriteController();

router.use(authorizedMiddleware);
router.post("/", favouriteController.addFavourite);

router.delete("/:id", favouriteController.removeFavourite);

router.get("/", favouriteController.getFavouritesByUser);

export default router;
