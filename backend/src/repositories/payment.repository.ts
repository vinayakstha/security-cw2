import { PaymentModel, IPaymentModel } from "../models/payment.model";

export class PaymentRepository {
  async create(payment: Partial<IPaymentModel>): Promise<IPaymentModel> {
    const newPayment = new PaymentModel(payment);
    return await newPayment.save();
  }

  async confirm(
    pidx: string,
    transactionId: string,
  ): Promise<IPaymentModel | null> {
    return PaymentModel.findOneAndUpdate(
      { pidx },
      { paymentStatus: "paid", transactionId, khaltiStatus: "Completed" },
      { new: true },
    );
  }

  async fail(pidx: string): Promise<IPaymentModel | null> {
    return PaymentModel.findOneAndUpdate(
      { pidx },
      { paymentStatus: "failed", khaltiStatus: "Failed" },
      { new: true },
    );
  }

  async getByPidx(pidx: string): Promise<IPaymentModel | null> {
    return PaymentModel.findOne({ pidx });
  }

  async getByBookingId(bookingId: string): Promise<IPaymentModel[]> {
    return PaymentModel.find({ bookingId });
  }
}
