import request from "supertest";
import app from "../../app";
import { CategoryModel } from "../../models/category.model";
import { ServiceModel } from "../../models/service.model";
import { BookingModel } from "../../models/booking.model";
import { UserModel } from "../../models/user.model";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

describe("Booking Integration Tests", () => {
  let authToken: string;
  let createdUserId: string;
  let createdCategoryId: string;
  let createdServiceId: string;
  let createdBookingId: string;

  const testCategory = {
    categoryName: "Plumbing Booking Integration Test",
    categoryImage: "plumbing.png",
  };

  const testService = {
    serviceName: "Pipe Fixing Booking Integration Test",
    serviceDescription: "Fix leaking pipes",
    serviceImage: "pipe-fixing.png",
    price: "100",
  };

  const bookingPayload = {
    bookingDate: "2025-12-01",
    bookingTime: "10:00 AM",
    location: "123 Main St",
  };

  beforeAll(async () => {
    // Clean up
    await CategoryModel.deleteMany({ categoryName: testCategory.categoryName });
    await ServiceModel.deleteMany({ serviceName: testService.serviceName });

    // Create temp user
    const user = await UserModel.create({
      firstName: "Test",
      lastName: "User",
      username: `bookingtest_${Date.now()}`,
      email: `bookingtest_${Date.now()}@test.com`,
      phoneNumber: `${Date.now()}`,
      password: "hashedpassword123",
      role: "user",
    });
    createdUserId = user._id.toString();

    authToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );

    // Create temp category and service
    const category = await CategoryModel.create(testCategory);
    createdCategoryId = category._id.toString();

    const service = await ServiceModel.create({
      ...testService,
      categoryId: new mongoose.Types.ObjectId(createdCategoryId),
    });
    createdServiceId = service._id.toString();

    // Clean any leftover bookings for this user
    await BookingModel.deleteMany({
      userId: new mongoose.Types.ObjectId(createdUserId),
    });
  });

  afterAll(async () => {
    await BookingModel.deleteMany({
      userId: new mongoose.Types.ObjectId(createdUserId),
    });
    await ServiceModel.deleteMany({ serviceName: testService.serviceName });
    await CategoryModel.deleteMany({ categoryName: testCategory.categoryName });
    await UserModel.deleteMany({ username: /^bookingtest_/ });
  });

  // ─── POST /api/booking ─────────────────────────────────────────────

  describe("POST /api/booking", () => {
    test("should create a booking successfully", async () => {
      const response = await request(app)
        .post("/api/booking")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ ...bookingPayload, serviceId: createdServiceId });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty(
        "message",
        "Booking created successfully",
      );
      expect(response.body.data).toHaveProperty(
        "bookingDate",
        bookingPayload.bookingDate,
      );
      expect(response.body.data).toHaveProperty(
        "bookingTime",
        bookingPayload.bookingTime,
      );
      expect(response.body.data).toHaveProperty("status", "pending");

      createdBookingId = response.body.data._id;
    });

    test("should return 401 when no token is provided", async () => {
      const response = await request(app)
        .post("/api/booking")
        .send({ ...bookingPayload, serviceId: createdServiceId });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("success", false);
    });

    test("should return 500 when required fields are missing", async () => {
      const response = await request(app)
        .post("/api/booking")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ serviceId: createdServiceId });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("success", false);
    });
  });

  // ─── GET /api/booking ──────────────────────────────────────────────

  describe("GET /api/booking", () => {
    test("should return bookings for authenticated user", async () => {
      const response = await request(app)
        .get("/api/booking")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty(
        "message",
        "Bookings fetched successfully",
      );
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test("should return 401 when no token is provided", async () => {
      const response = await request(app).get("/api/booking");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("PATCH /api/booking/:id/cancel", () => {
    test("should cancel a booking successfully", async () => {
      const response = await request(app)
        .patch(`/api/booking/${createdBookingId}/cancel`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty(
        "message",
        "Booking cancelled successfully",
      );
      expect(response.body.data).toHaveProperty("status", "cancelled");
    });

    test("should return 401 when no token is provided", async () => {
      const response = await request(app).patch(
        `/api/booking/${createdBookingId}/cancel`,
      );

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("DELETE /api/booking/:id", () => {
    test("should delete a booking successfully", async () => {
      // Create a fresh booking to delete
      const booking = await BookingModel.create({
        userId: new mongoose.Types.ObjectId(createdUserId),
        serviceId: new mongoose.Types.ObjectId(createdServiceId),
        bookingDate: "2025-12-03",
        bookingTime: "12:00 PM",
        price: "100",
        location: "123 Main St",
        status: "pending",
      });

      const response = await request(app)
        .delete(`/api/booking/${booking._id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty(
        "message",
        "Booking deleted successfully",
      );
    });

    test("should return 401 when no token is provided", async () => {
      const response = await request(app).delete(
        `/api/booking/${createdBookingId}`,
      );

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("success", false);
    });
  });
});
