import request from "supertest";
import app from "../../app";
import { CategoryModel } from "../../models/category.model";
import { UserModel } from "../../models/user.model";
import jwt from "jsonwebtoken";

describe("Category Integration Tests", () => {
  let authToken: string;
  let createdCategoryId: string;

  const testCategory = {
    categoryName: "Plumbing Integration Test",
    categoryImage: "plumbing.png",
  };

  beforeAll(async () => {
    await CategoryModel.deleteMany({ categoryName: testCategory.categoryName });

    const user = await UserModel.create({
      firstName: "Test",
      lastName: "User",
      username: `cattest_${Date.now()}`,
      email: `cattest_${Date.now()}@test.com`,
      phoneNumber: `${Date.now()}`,
      password: "hashedpassword123",
      role: "user",
    });

    authToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );

    const category = await CategoryModel.create(testCategory);
    createdCategoryId = category._id.toString();
  });

  afterAll(async () => {
    await CategoryModel.deleteMany({ categoryName: testCategory.categoryName });
    await UserModel.deleteMany({ username: /^cattest_/ });
  });

  describe("GET /api/category", () => {
    test("should return all categories", async () => {
      const response = await request(app)
        .get("/api/category")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("message", "all categories fetched");
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test("should return 401 when no token is provided", async () => {
      const response = await request(app).get("/api/category");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("GET /api/category/:id", () => {
    test("should return a category by id", async () => {
      const response = await request(app)
        .get(`/api/category/${createdCategoryId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("message", "category retrived");
      expect(response.body.data).toHaveProperty(
        "categoryName",
        testCategory.categoryName,
      );
      expect(response.body.data).toHaveProperty(
        "categoryImage",
        testCategory.categoryImage,
      );
    });

    test("should return 500 when category not found", async () => {
      const fakeId = "000000000000000000000000";

      const response = await request(app)
        .get(`/api/category/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("success", false);
    });

    test("should return 401 when no token is provided", async () => {
      const response = await request(app).get(
        `/api/category/${createdCategoryId}`,
      );

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("success", false);
    });
  });
});
