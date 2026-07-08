import { QueryFilter } from "mongoose";
import { UserModel, IUser } from "../models/user.model";

export interface IUserRepository {
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  createUser(userData: Partial<IUser>): Promise<IUser>;
  getUserById(id: string): Promise<IUser | null>;
  getAllUsers(
    page: number,
    size: number,
    search?: string,
  ): Promise<{ users: IUser[]; total: number }>;
  getCurrentUser(id: string): Promise<IUser | null>;
  updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null>;
  deleteUser(id: string): Promise<boolean>;
}

export class UserRepository implements IUserRepository {
  async getUserByEmail(email: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ email: email });
    return user;
  }
  async getUserByUsername(username: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ username: username });
    return user;
  }
  async getUserById(id: string): Promise<IUser | null> {
    const user = await UserModel.findById(id);
    return user;
  }

  async getUserByPhoneNumber(phoneNumber: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ phoneNumber: phoneNumber });
    return user;
  }

  // async getAllUsers(): Promise<IUser[]> {
  //   const users = await UserModel.find();
  //   return users;
  // }

  async getAllUsers(
    page: number,
    size: number,
    search?: string,
  ): Promise<{ users: IUser[]; total: number }> {
    const filter: QueryFilter<IUser> = {};
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ];
    }
    const [users, total] = await Promise.all([
      UserModel.find(filter)
        .skip((page - 1) * size)
        .limit(size),
      UserModel.countDocuments(filter),
    ]);
    return { users, total };
  }

  async updateUser(
    id: string,
    updateData: Partial<IUser>,
  ): Promise<IUser | null> {
    const updateUser = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return updateUser;
  }
  async deleteUser(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return result ? true : false;
  }
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(userData);
    return await user.save();
  }

  async getCurrentUser(id: string): Promise<IUser | null> {
    const user = await UserModel.findById(id).select("-password");
    return user;
  }
}
