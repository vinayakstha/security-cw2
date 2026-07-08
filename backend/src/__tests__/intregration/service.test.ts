import request from "supertest";
import app from "../../app";
import { CategoryModel } from "../../models/category.model";
import { ServiceModel } from "../../models/service.model";
import { UserModel } from "../../models/user.model";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

describe("Service Integration Tests", () => {
  let authToken: string;
  let createdCategoryId: string;
  let createdServiceId: string;

  const testCategory = {
    categoryName: "Plumbing Service Integration Test",
    categoryImage: "plumbing.png",
  };

  const testService = {
    serviceName: "Pipe Fixing Integration Test",
    serviceDescription: "Fix leaking pipes",
    serviceImage: "pipe-fixing.png",
    price: "100",
  };

  beforeAll(async () => {
    await ServiceModel.deleteMany({ serviceName: testService.serviceName });
    await CategoryModel.deleteMany({ categoryName: testCategory.categoryName });

    // Create temp user for auth token
    const user = await UserModel.create({
      firstName: "Test",
      lastName: "User",
      username: `svctest_${Date.now()}`,
      email: `svctest_${Date.now()}@test.com`,
      phoneNumber: `${Date.now()}`,
      password: "hashedpassword123",
      role: "user",
    });

    authToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );

    // Create temp category and service directly in DB
    const category = await CategoryModel.create(testCategory);
    createdCategoryId = category._id.toString();

    const service = await ServiceModel.create({
      ...testService,
      categoryId: new mongoose.Types.ObjectId(createdCategoryId),
    });
    createdServiceId = service._id.toString();
  });

  afterAll(async () => {
    await ServiceModel.deleteMany({ serviceName: testService.serviceName });
    await CategoryModel.deleteMany({ categoryName: testCategory.categoryName });
    await UserModel.deleteMany({ username: /^svctest_/ });
  });

  // ─── GET /api/service ──────────────────────────────────────────────

  describe("GET /api/service", () => {
    test("should return all services", async () => {
      const response = await request(app)
        .get("/api/service")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("message", "all services fetched");
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test("should return 401 when no token is provided", async () => {
      const response = await request(app).get("/api/service");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("GET /api/service/category/:categoryId", () => {
    test("should return services for a valid category", async () => {
      const response = await request(app)
        .get(`/api/service/category/${createdCategoryId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty(
        "message",
        "services by category fetched",
      );
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty(
        "serviceName",
        testService.serviceName,
      );
    });

    test("should return empty array for category with no services", async () => {
      const fakeCategoryId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .get(`/api/service/category/${fakeCategoryId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);
    });

    test("should return 401 when no token is provided", async () => {
      const response = await request(app).get(
        `/api/service/category/${createdCategoryId}`,
      );

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("GET /api/service/:id", () => {
    test("should return a service by id", async () => {
      const response = await request(app)
        .get(`/api/service/${createdServiceId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("message", "service retrieved");
      expect(response.body.data).toHaveProperty(
        "serviceName",
        testService.serviceName,
      );
      expect(response.body.data).toHaveProperty("price", testService.price);
    });

    test("should return 500 when service not found", async () => {
      const fakeId = "000000000000000000000000";

      const response = await request(app)
        .get(`/api/service/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("success", false);
    });

    test("should return 401 when no token is provided", async () => {
      const response = await request(app).get(
        `/api/service/${createdServiceId}`,
      );

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("success", false);
    });
  });
});
