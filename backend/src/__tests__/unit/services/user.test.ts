import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserService } from "../../../services/user.service";
import { UserRepository } from "../../../repositories/user.repository";
import { HttpError } from "../../../errors/http-error";
import { sendEmail } from "../../../config/email";

// ── Mocks ─────────────────────────────────────────────────────────────────────
jest.mock("../../../repositories/user.repository");
jest.mock("../../../config/email");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

// ── Helpers ───────────────────────────────────────────────────────────────────
const makeId = () => new mongoose.Types.ObjectId().toString();

const makeUser = (overrides: Record<string, unknown> = {}) => ({
  _id: new mongoose.Types.ObjectId(),
  email: "test@example.com",
  username: "testuser",
  firstName: "John",
  lastName: "Doe",
  password: "hashed_password",
  role: "user",
  phoneNumber: "1234567890",
  profilePicture: "",
  ...overrides,
});

// ── Setup ─────────────────────────────────────────────────────────────────────
describe("UserService", () => {
  let service: UserService;
  let userRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    userRepo = {
      createUser: jest.fn(),
      getUserByEmail: jest.fn(),
      getUserByUsername: jest.fn(),
      getUserByPhoneNumber: jest.fn(),
      getUserById: jest.fn(),
      getCurrentUser: jest.fn(),
      updateUser: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    jest
      .spyOn(UserRepository.prototype, "createUser")
      .mockImplementation(userRepo.createUser);
    jest
      .spyOn(UserRepository.prototype, "getUserByEmail")
      .mockImplementation(userRepo.getUserByEmail);
    jest
      .spyOn(UserRepository.prototype, "getUserByUsername")
      .mockImplementation(userRepo.getUserByUsername);
    jest
      .spyOn(UserRepository.prototype, "getUserByPhoneNumber")
      .mockImplementation(userRepo.getUserByPhoneNumber);
    jest
      .spyOn(UserRepository.prototype, "getUserById")
      .mockImplementation(userRepo.getUserById);
    jest
      .spyOn(UserRepository.prototype, "getCurrentUser")
      .mockImplementation(userRepo.getCurrentUser);
    jest
      .spyOn(UserRepository.prototype, "updateUser")
      .mockImplementation(userRepo.updateUser);

    service = new UserService();
  });

  // ── createUser ─────────────────────────────────────────────────────────────
  describe("createUser", () => {
    const dto = {
      email: "new@example.com",
      username: "newuser",
      password: "plaintext",
    };

    it("should create a user successfully", async () => {
      const newUser = makeUser({ email: dto.email, username: dto.username });

      userRepo.getUserByEmail.mockResolvedValue(null);
      userRepo.getUserByUsername.mockResolvedValue(null);
      (bcryptjs.hash as jest.Mock).mockResolvedValue("hashed_password");
      userRepo.createUser.mockResolvedValue(newUser as any);

      const result = await service.createUser(dto as any);

      expect(userRepo.getUserByEmail).toHaveBeenCalledWith(dto.email);
      expect(userRepo.getUserByUsername).toHaveBeenCalledWith(dto.username);
      expect(bcryptjs.hash).toHaveBeenCalledWith("plaintext", 10);
      expect(userRepo.createUser).toHaveBeenCalledWith(
        expect.objectContaining({ password: "hashed_password" }),
      );
      expect(result).toEqual(newUser);
    });

    it("should throw 403 when email is already in use", async () => {
      userRepo.getUserByEmail.mockResolvedValue(makeUser() as any);

      await expect(service.createUser(dto as any)).rejects.toThrow(
        new HttpError(403, "Email already in use"),
      );

      expect(userRepo.getUserByUsername).not.toHaveBeenCalled();
      expect(userRepo.createUser).not.toHaveBeenCalled();
    });

    it("should throw 403 when username is already in use", async () => {
      userRepo.getUserByEmail.mockResolvedValue(null);
      userRepo.getUserByUsername.mockResolvedValue(makeUser() as any);

      await expect(service.createUser(dto as any)).rejects.toThrow(
        new HttpError(403, "Username already in use"),
      );

      expect(userRepo.createUser).not.toHaveBeenCalled();
    });
  });

  // ── loginUser ──────────────────────────────────────────────────────────────
  describe("loginUser", () => {
    const dto = { email: "test@example.com", password: "plaintext" };

    it("should login successfully and return a token", async () => {
      const user = makeUser();

      userRepo.getUserByEmail.mockResolvedValue(user as any);
      (bcryptjs.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("mock_token");

      const result = await service.loginUser(dto);

      expect(userRepo.getUserByEmail).toHaveBeenCalledWith(dto.email);
      expect(bcryptjs.compare).toHaveBeenCalledWith(
        dto.password,
        user.password,
      );
      expect(jwt.sign).toHaveBeenCalled();
      expect(result).toEqual({ token: "mock_token", user });
    });

    it("should throw 404 when user is not found", async () => {
      userRepo.getUserByEmail.mockResolvedValue(null);

      await expect(service.loginUser(dto)).rejects.toThrow(
        new HttpError(404, "User not found"),
      );

      expect(bcryptjs.compare).not.toHaveBeenCalled();
    });

    it("should throw 401 when password is invalid", async () => {
      userRepo.getUserByEmail.mockResolvedValue(makeUser() as any);
      (bcryptjs.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.loginUser(dto)).rejects.toThrow(
        new HttpError(401, "Invalid credentials"),
      );

      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });

  // ── getUserById ────────────────────────────────────────────────────────────
  describe("getUserById", () => {
    it("should return a user for a valid ID", async () => {
      const userId = makeId();
      const user = makeUser();

      userRepo.getUserById.mockResolvedValue(user as any);

      const result = await service.getUserById(userId);

      expect(userRepo.getUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(user);
    });

    it("should throw 404 when user is not found", async () => {
      userRepo.getUserById.mockResolvedValue(null);

      await expect(service.getUserById(makeId())).rejects.toThrow(
        new HttpError(404, "User not found"),
      );
    });
  });

  // ── getCurrentUser ─────────────────────────────────────────────────────────
  describe("getCurrentUser", () => {
    it("should return the current user", async () => {
      const userId = makeId();
      const user = makeUser();

      userRepo.getCurrentUser.mockResolvedValue(user as any);

      const result = await service.getCurrentUser(userId);

      expect(userRepo.getCurrentUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(user);
    });

    it("should throw 404 when user is not found", async () => {
      userRepo.getCurrentUser.mockResolvedValue(null);

      await expect(service.getCurrentUser(makeId())).rejects.toThrow(
        new HttpError(404, "User not found"),
      );
    });
  });
});
