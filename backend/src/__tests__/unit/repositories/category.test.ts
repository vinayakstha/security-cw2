import { CategoryRepository } from "../../../repositories/category.repository";
import { CategoryModel } from "../../../models/category.model";

describe("Category Repository Unit Tests", () => {
  const categoryRepository = new CategoryRepository();

  const testCategory = {
    categoryName: "Plumbing",
    categoryImage: "plumbing.png",
  };

  let createdCategoryId: string;

  beforeAll(async () => {
    await CategoryModel.deleteMany({ categoryName: testCategory.categoryName });
  });

  afterAll(async () => {
    await CategoryModel.deleteMany({ categoryName: testCategory.categoryName });
  });

  test("should create a new category", async () => {
    const category = await categoryRepository.createCategory(testCategory);

    expect(category).toBeDefined();
    expect(category._id).toBeDefined();
    expect(category.categoryName).toBe(testCategory.categoryName);
    expect(category.categoryImage).toBe(testCategory.categoryImage);

    createdCategoryId = category._id.toString();
  });

  test("should get category by id", async () => {
    const category =
      await categoryRepository.getCategoryById(createdCategoryId);

    expect(category).not.toBeNull();
    expect(category?.categoryName).toBe(testCategory.categoryName);
  });

  test("should get category by name", async () => {
    const category = await categoryRepository.getCategoryByName(
      testCategory.categoryName,
    );

    expect(category).not.toBeNull();
    expect(category?.categoryName).toBe(testCategory.categoryName);
  });

  test("should get all categories", async () => {
    const categories = await categoryRepository.getAllCategories();

    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  test("should update a category image", async () => {
    const updatedCategory = await categoryRepository.updateCategory(
      createdCategoryId,
      { categoryImage: "updated-plumbing.png" },
    );

    expect(updatedCategory).not.toBeNull();
    expect(updatedCategory?.categoryImage).toBe("updated-plumbing.png");
  });

  test("should delete a category", async () => {
    const result = await categoryRepository.deleteCategory(createdCategoryId);

    expect(result).toBe(true);

    const deletedCategory =
      await categoryRepository.getCategoryById(createdCategoryId);
    expect(deletedCategory).toBeNull();
  });
});
