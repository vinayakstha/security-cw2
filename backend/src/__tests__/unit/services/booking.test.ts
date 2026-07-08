import { UserBookingService } from "../../../services/booking.service";
import { HttpError } from "../../../errors/http-error";
import mongoose from "mongoose";

jest.mock("../../../repositories/booking.repository", () => ({
  BookingRepository: jest.fn().mockImplementation(() => ({
    createBooking: jest.fn(),
    getBookingById: jest.fn(),
    getBookingsByService: jest.fn(),
    getBookingsByUser: jest.fn(),
    updateBookingStatus: jest.fn(),
    deleteBooking: jest.fn(),
  })),
}));

jest.mock("../../../repositories/service.repository", () => ({
  ServiceRepository: jest.fn().mockImplementation(() => ({
    getServiceById: jest.fn(),
  })),
}));

jest.mock("../../../utils/sendBookingConfirmationEmail", () => ({
  sendBookingConfirmationEmail: jest.fn(),
}));

import { BookingRepository } from "../../../repositories/booking.repository";
import { ServiceRepository } from "../../../repositories/service.repository";
import { sendBookingConfirmationEmail } from "../../../utils/sendBookingConfirmationEmail";

describe("UserBookingService Unit Tests", () => {
  let userBookingService: UserBookingService;
  let bookingMocks: any;
  let serviceMocks: any;

  beforeEach(() => {
    jest.clearAllMocks();
    userBookingService = new UserBookingService();

    bookingMocks = (BookingRepository as jest.Mock).mock.instances[0];
    serviceMocks = (ServiceRepository as jest.Mock).mock.instances[0];
  });

  describe("getBookingsByUser", () => {
    test("should throw HttpError 400 for invalid user ID", async () => {
      await expect(
        userBookingService.getBookingsByUser("invalid-id"),
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "Invalid user ID",
      });
    });
  });
});
