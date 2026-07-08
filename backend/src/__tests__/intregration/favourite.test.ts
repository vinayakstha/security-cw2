import request from "supertest";
import app from "../../app";
import { CategoryModel } from "../../models/category.model";
import { ServiceModel } from "../../models/service.model";
import { FavouriteModel } from "../../models/favourite.model";
import { UserModel } from "../../models/user.model";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

describe("Favourite Integration Tests", () => {
  let authToken: string;
  let createdUserId: string;
  let createdCategoryId: string;
  let createdServiceId: string;
  let createdFavouriteId: string;

  const testCategory = {
    categoryName: "Plumbing Favourite Integration Test",
    categoryImage: "plumbing.png",
  };

  const testService = {
    serviceName: "Pipe Fixing Favourite Integration Test",
    serviceDescription: "Fix leaking pipes",
    serviceImage: "pipe-fixing.png",
    price: "100",
  };

  beforeAll(async () => {
    await CategoryModel.deleteMany({ categoryName: testCategory.categoryName });
    await ServiceModel.deleteMany({ serviceName: testService.serviceName });

    // Create temp user
    const user = await UserModel.create({
      firstName: "Test",
      lastName: "User",
      username: `favtest_${Date.now()}`,
      email: `favtest_${Date.now()}@test.com`,
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

    // Clean any leftover favourites for this user
    await FavouriteModel.deleteMany({
      userId: new mongoose.Types.ObjectId(createdUserId),
    });
  });

  afterAll(async () => {
    await FavouriteModel.deleteMany({
      userId: new mongoose.Types.ObjectId(createdUserId),
    });
    await ServiceModel.deleteMany({ serviceName: testService.serviceName });
    await CategoryModel.deleteMany({ categoryName: testCategory.categoryName });
    await UserModel.deleteMany({ username: /^favtest_/ });
  });

  describe("POST /api/favourite", () => {
    test("should add a service to favourites", async () => {
      const response = await request(app)
        .post("/api/favourite")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ serviceId: createdServiceId });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty(
        "message",
        "Service added to favourites",
      );
      expect(response.body.data).toHaveProperty("serviceId");
      expect(response.body.data).toHaveProperty("userId");

      createdFavouriteId = response.body.data._id;
    });

    test("should return 401 when no token is provided", async () => {
      const response = await request(app)
        .post("/api/favourite")
        .send({ serviceId: createdServiceId });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("GET /api/favourite", () => {
    test("should return all favourites for authenticated user", async () => {
      const response = await request(app)
        .get("/api/favourite")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty(
        "message",
        "Favourites fetched successfully",
      );
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test("should return empty array when user has no favourites", async () => {
      // Create a fresh user with no favourites
      const newUser = await UserModel.create({
        firstName: "Empty",
        lastName: "User",
        username: `favtest_empty_${Date.now()}`,
        email: `favtest_empty_${Date.now()}@test.com`,
        phoneNumber: `8${Date.now()}`,
        password: "hashedpassword123",
        role: "user",
      });

      const newToken = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" },
      );

      const response = await request(app)
        .get("/api/favourite")
        .set("Authorization", `Bearer ${newToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);

      await UserModel.findByIdAndDelete(newUser._id);
    });

    test("should return 401 when no token is provided", async () => {
      const response = await request(app).get("/api/favourite");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("success", false);
    });
  });

  // ─── DELETE /api/favourite/:id ─────────────────────────────────────

  describe("DELETE /api/favourite/:id", () => {
    test("should delete a favourite successfully", async () => {
      const response = await request(app)
        .delete(`/api/favourite/${createdFavouriteId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty(
        "message",
        "Favourite removed successfully",
      );
    });

    test("should return 401 when no token is provided", async () => {
      const response = await request(app).delete(
        `/api/favourite/${createdFavouriteId}`,
      );

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("success", false);
    });
  });
});
