import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const GMAIL_USER="mohdsameer3134@gmail.com";
const GMAIL_APP_PASSWORD="luls smqq lilk mcid"
async function sendEmail(to, id, campaign) {
  try {
    // Setup transporter for Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });
    console.log("r",GMAIL_APP_PASSWORD)
    // Unique tracking URL (adds uniq timestamp to avoid Gmail caching)
    const trackUrl = `https://mail-tracker-chi.vercel.app/api/track?id=${id}&rcpt=${to}&camp=${campaign}`;
    console.log("m",trackUrl)
    // Email content with tracking image
    const html = `
      <p>👋 Hello ${to},</p>
      <h2>hello how are you</h2>
      <img src="https://png.pngtree.com/png-vector/20190330/ourmid/pngtree-img-file-document-icon-png-image_893028.jpg"
           width="2"
           alt="Promo Image">
      <p>Cheers,<br>Mohd Sameer</p>
    `;

    // Mail options
    const mailOptions = {
      from: `Mohd Sameer <${GMAIL_USER}>`,
      to,
      subject: `Promo Email - ${campaign}`,
      html,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
}

// Example usage
sendEmail("gauravsingh7305@gmail.com", "abc123", "promo1");
