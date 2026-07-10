import { transporter } from "./mailer";

interface BookingEmailOptions {
  toEmail: string;
  userName: string;
  bookingDate: string;
  bookingTime: string;
  location: string;
  serviceTitle: string;
}

/**
 * Escape HTML special characters to prevent XSS/HTML injection.
 */
function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return str.replace(/[&<>"']/g, (char) => map[char]);
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
        <p>Hi <strong>${escapeHtml(userName)}</strong>, your booking has been successfully created.</p>
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Service</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(serviceTitle)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(bookingDate)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Time</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(bookingTime)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Location</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(location)}</td>
          </tr>
        </table>
        <p style="margin-top: 20px;">Thank you for booking with us!</p>
      </div>
    `,
  });
}
