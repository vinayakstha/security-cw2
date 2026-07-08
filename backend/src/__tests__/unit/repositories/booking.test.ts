import { BookingRepository } from "../../../repositories/booking.repository";
import { BookingModel } from "../../../models/booking.model";
import { CategoryModel } from "../../../models/category.model";
import { ServiceModel } from "../../../models/service.model";
import { UserModel } from "../../../models/user.model";
import mongoose from "mongoose";

describe("Booking Repository Unit Tests", () => {
  const bookingRepository = new BookingRepository();

  let createdCategoryId: string;
  let createdServiceId: string;
  let createdUserId: string;
  let createdBookingId: string;

  const testBooking = {
    bookingDate: "2025-06-01",
    bookingTime: "10:00 AM",
    price: "100",
    location: "123 Main St",
    status: "pending" as const,
  };

  beforeAll(async () => {
    // Create temp category
    const category = await CategoryModel.create({
      categoryName: "Plumbing Test",
      categoryImage: "plumbing.png",
    });
    createdCategoryId = category._id.toString();

    // Create temp service
    const service = await ServiceModel.create({
      serviceName: "Pipe Fixing",
      serviceImage: "pipe-fixing.png",
      serviceDescription: "Fix leaking pipes",
      price: "100",
      categoryId: new mongoose.Types.ObjectId(createdCategoryId),
    });
    createdServiceId = service._id.toString();

    // Create a real temp user so populate("userId") works
    const user = await UserModel.create({
      firstName: "Test",
      lastName: "User",
      username: `testuser_${Date.now()}`,
      email: `testuser_${Date.now()}@test.com`,
      phoneNumber: `${Date.now()}`,
      password: "hashedpassword123",
      role: "user",
    });
    createdUserId = user._id.toString();

    // Clean any leftover test bookings
    await BookingModel.deleteMany({
      userId: new mongoose.Types.ObjectId(createdUserId),
    });
  });

  afterAll(async () => {
    await BookingModel.deleteMany({
      userId: new mongoose.Types.ObjectId(createdUserId),
    });
    await UserModel.findByIdAndDelete(createdUserId);
    await ServiceModel.findByIdAndDelete(createdServiceId);
    await CategoryModel.findByIdAndDelete(createdCategoryId);
  });

  test("should create a new booking", async () => {
    const booking = await bookingRepository.createBooking({
      ...testBooking,
      userId: new mongoose.Types.ObjectId(createdUserId),
      serviceId: new mongoose.Types.ObjectId(createdServiceId),
    });

    expect(booking).toBeDefined();
    expect(booking._id).toBeDefined();
    expect(booking.userId.toString()).toBe(createdUserId);
    expect(booking.serviceId.toString()).toBe(createdServiceId);
    expect(booking.bookingDate).toBe(testBooking.bookingDate);
    expect(booking.bookingTime).toBe(testBooking.bookingTime);
    expect(booking.price).toBe(testBooking.price);
    expect(booking.location).toBe(testBooking.location);
    expect(booking.status).toBe("pending");

    createdBookingId = booking._id.toString();
  });

  test("should get booking by id", async () => {
    const booking = await bookingRepository.getBookingById(createdBookingId);

    expect(booking).not.toBeNull();
    expect(booking?.bookingDate).toBe(testBooking.bookingDate);
    expect(booking?.bookingTime).toBe(testBooking.bookingTime);
    expect(booking?.price).toBe(testBooking.price);

    // Verify populate worked for both userId and serviceId
    const populatedUser = booking?.userId as any;
    expect(populatedUser.firstName).toBe("Test");

    const populatedService = booking?.serviceId as any;
    expect(populatedService.serviceName).toBe("Pipe Fixing");
  });

  test("should get all bookings", async () => {
    const bookings = await bookingRepository.getAllBookings();

    expect(Array.isArray(bookings)).toBe(true);
    expect(bookings.length).toBeGreaterThan(0);
  });

  test("should get bookings by user", async () => {
    const bookings = await bookingRepository.getBookingsByUser(createdUserId);

    expect(Array.isArray(bookings)).toBe(true);
    expect(bookings.length).toBeGreaterThan(0);
    expect(bookings[0].userId.toString()).toBe(createdUserId);
  });

  test("should get bookings by service", async () => {
    const bookings =
      await bookingRepository.getBookingsByService(createdServiceId);

    expect(Array.isArray(bookings)).toBe(true);
    expect(bookings.length).toBeGreaterThan(0);
    expect(bookings[0].serviceId.toString()).toBe(createdServiceId);

    // Verify populate worked for userId
    const populatedUser = bookings[0].userId as any;
    expect(populatedUser.firstName).toBe("Test");
  });

  test("should update booking status to paid", async () => {
    const updatedBooking = await bookingRepository.updateBookingStatus(
      createdBookingId,
      "paid",
    );

    expect(updatedBooking).not.toBeNull();
    expect(updatedBooking?.status).toBe("paid");
  });

  test("should update booking status to completed", async () => {
    const updatedBooking = await bookingRepository.updateBookingStatus(
      createdBookingId,
      "completed",
    );

    expect(updatedBooking).not.toBeNull();
    expect(updatedBooking?.status).toBe("completed");
  });

  test("should update booking status to cancelled", async () => {
    const updatedBooking = await bookingRepository.updateBookingStatus(
      createdBookingId,
      "cancelled",
    );

    expect(updatedBooking).not.toBeNull();
    expect(updatedBooking?.status).toBe("cancelled");
  });

  test("should delete a booking", async () => {
    const result = await bookingRepository.deleteBooking(createdBookingId);

    expect(result).toBe(true);

    const deletedBooking =
      await bookingRepository.getBookingById(createdBookingId);
    expect(deletedBooking).toBeNull();
  });
});
