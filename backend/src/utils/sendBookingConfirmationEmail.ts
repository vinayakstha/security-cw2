import { transporter } from "./mailer";

interface BookingEmailOptions {
  toEmail: string;
  userName: string;
  bookingDate: string;
  bookingTime: string;
  location: string;
  serviceTitle: string; // ✅ add this
}

export async function sendBookingConfirmationEmail(
  options: BookingEmailOptions,
): Promise<void> {
  const {
    toEmail,
    userName,
    bookingDate,
    bookingTime,
    location,
    serviceTitle,
  } = options;

  await transporter.sendMail({
    from: `"Gharcare" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: "Booking Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Booking Confirmed!</h2>
        <p>Hi <strong>${userName}</strong>, your booking has been successfully created.</p>
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Service</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${serviceTitle}</td>  <!-- ✅ add this row -->
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${bookingDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Time</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${bookingTime}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Location</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${location}</td>
          </tr>
        </table>
        <p style="margin-top: 20px;">Thank you for booking with us!</p>
      </div>
    `,
  });
}
