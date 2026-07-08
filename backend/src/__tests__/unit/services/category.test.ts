import { CategoryService } from "../../../services/category.service";
import { CategoryRepository } from "../../../repositories/category.repository";
import { HttpError } from "../../../errors/http-error";

describe("Category Service Unit Tests", () => {
  let categoryService: CategoryService;
  let mockGetCategoryById: jest.SpyInstance;
  let mockGetAllCategories: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGetCategoryById = jest
      .spyOn(CategoryRepository.prototype, "getCategoryById")
      .mockResolvedValue(null);

    mockGetAllCategories = jest
      .spyOn(CategoryRepository.prototype, "getAllCategories")
      .mockResolvedValue([]);

    categoryService = new CategoryService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getCategoryById", () => {
    test("should return category when found", async () => {
      const mockCategory = {
        _id: "cat123",
        categoryName: "Plumbing",
        categoryImage: "plumbing.png",
      };

      mockGetCategoryById.mockResolvedValue(mockCategory);

      const result = await categoryService.getCategoryById("cat123");

      expect(mockGetCategoryById).toHaveBeenCalledWith("cat123");
      expect(result).toEqual(mockCategory);
    });

    test("should throw HttpError 404 when category not found", async () => {
      mockGetCategoryById.mockResolvedValue(null);

      await expect(
        categoryService.getCategoryById("nonexistent123"),
      ).rejects.toThrow(HttpError);

      await expect(
        categoryService.getCategoryById("nonexistent123"),
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "category not found",
      });
    });

    test("should propagate unexpected repository errors", async () => {
      mockGetCategoryById.mockRejectedValue(new Error("Database error"));

      await expect(categoryService.getCategoryById("cat123")).rejects.toThrow(
        "Database error",
      );
    });
  });

  describe("getAllCategories", () => {
    test("should return all categories", async () => {
      const mockCategories = [
        {
          _id: "cat123",
          categoryName: "Plumbing",
          categoryImage: "plumbing.png",
        },
        {
          _id: "cat456",
          categoryName: "Electrical",
          categoryImage: "electrical.png",
        },
      ];

      mockGetAllCategories.mockResolvedValue(mockCategories);

      const result = await categoryService.getAllCategories();

      expect(mockGetAllCategories).toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
    });

    test("should return empty array when no categories exist", async () => {
      mockGetAllCategories.mockResolvedValue([]);

      const result = await categoryService.getAllCategories();

      expect(result).toEqual([]);
    });

    test("should propagate unexpected repository errors", async () => {
      mockGetAllCategories.mockRejectedValue(new Error("Database error"));

      await expect(categoryService.getAllCategories()).rejects.toThrow(
        "Database error",
      );
    });
  });
});
