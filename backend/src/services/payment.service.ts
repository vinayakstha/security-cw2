import axios from "axios";
import { InitiatePaymentDtoType } from "../dtos/payment.dto";
import { PaymentRepository } from "../repositories/payment.repository";
import { BookingRepository } from "../repositories/booking.repository";

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY!;
const KHALTI_BASE_URL = "https://dev.khalti.com/api/v2";

const paymentRepo = new PaymentRepository();
const bookingRepo = new BookingRepository();

export class PaymentService {
  async initiatePayment(payload: InitiatePaymentDtoType) {
    const { bookingId } = payload;

    // Check if booking already has a successful payment
    const existingPayments = await paymentRepo.getByBookingId(bookingId);
    const alreadyPaid = existingPayments.some(
      (p) => p.paymentStatus === "paid",
    );
    if (alreadyPaid) throw new Error("This booking has already been paid");

    const booking = await bookingRepo.getBookingById(bookingId);
    if (!booking) throw new Error("Booking not found");

    const user = booking.userId as any;
    const fullName =
      `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Customer";
    const email = user?.email;
    const totalPrice = parseFloat(booking.price);

    if (!email) throw new Error("User email not found");

    const response = await axios.post(
      `${KHALTI_BASE_URL}/epayment/initiate/`,
      {
        return_url: `${process.env.CLIENT_URL}/user/booking/verify`,
        website_url: process.env.CLIENT_URL,
        amount: totalPrice * 100,
        purchase_order_id: bookingId,
        purchase_order_name: `Service Booking - ${bookingId}`,
        customer_info: { name: fullName, email },
      },
      {
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const { pidx, payment_url } = response.data;

    await paymentRepo.create({
      bookingId: booking._id,
      pidx,
      totalPrice,
      fullName,
      email,
      paymentStatus: "pending",
    });

    return { pidx, payment_url };
  }

  async verifyPayment(pidx: string) {
    const response = await axios.post(
      `${KHALTI_BASE_URL}/epayment/lookup/`,
      { pidx },
      {
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const { status, transaction_id, total_amount } = response.data;

    if (status?.toLowerCase() === "completed") {
      const payment = await paymentRepo.confirm(pidx, transaction_id);

      // Get bookingId from our own payment record using pidx
      const paymentRecord = await paymentRepo.getByPidx(pidx);

      if (paymentRecord) {
        await bookingRepo.updateBookingStatus(
          paymentRecord.bookingId.toString(),
          "paid",
        );
      }

      return {
        success: true,
        transactionId: transaction_id,
        bookingId: paymentRecord?.bookingId.toString(),
        amount: total_amount / 100,
        payment,
      };
    }

    await paymentRepo.fail(pidx);
    return { success: false, status };
  }
}
