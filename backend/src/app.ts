import express, { Application, Request, response, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import adminUserRoutes from "./routes/admin/user.route";
import adminCategoryRoutes from "./routes/admin/category.route";
import adminServiceRoutes from "./routes/admin/service.route";
import adminBookingRoutes from "./routes/admin/booking.route";
import categoryRoutes from "./routes/category.route";
import serviceRoutes from "./routes/service.route";
import bookingRoutes from "./routes/booking.route";
import favouriteRoutes from "./routes/favourite.route";
import paymentRoutes from "./routes/payment.route";
import totpRoutes from "./routes/totp.route";
import cors from "cors";
import path from "path";

dotenv.config();

const app: Application = express();

let corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3003"],
};

app.set("trust proxy", 1);

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));
const uploadsPath = path.resolve(__dirname, "../uploads"); // adjust based on where uploads is
app.use("/uploads", express.static(uploadsPath));

//user routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/favourite", favouriteRoutes);

app.use("/api", paymentRoutes);

//totp routes
app.use("/api/auth/totp", totpRoutes);

//admin routes
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/category", adminCategoryRoutes);
app.use("/api/admin/service", adminServiceRoutes);
app.use("/api/admin/booking", adminBookingRoutes);

app.get("/", (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ success: "true", message: "welcome to the api" });
});

export default app;
