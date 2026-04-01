const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  // 1. Security validation
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('Configuration Error: Missing SMTP credentials in .env file.');
    throw new Error('Email delivery system is not configured.');
  }

  try {
    // 2. Start logging footprint
    console.log(`[Email System] Initiating transmission to: ${to}`);

    // 3. STRICT Gmail Transport Structure
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, 
      auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS 
      }
    });

    // 4. Parameterized Send options
    const message = {
      from: '"SmartSlot" <ramanavasu9th@gmail.com>', // Forced override via user spec
      to,
      subject,
      html
    };

    // 5. Native dispatch with await constraints
    const info = await transporter.sendMail(message);
    console.log(`[Email System] Successfully delivered! Message ID: ${info.messageId}`);
    return info;

  } catch (error) {
    console.error(`[Email System] Critical failure dispatching to ${to}:`, error.message);
    throw error;
  }
};

// 6. Test sequence wrapper
const verifyEmailConfiguration = async () => {
  console.log('--- Triggering Gmail Configuration Test ---');
  try {
    await sendEmail({
      to: 'ramanavasu9th@gmail.com', // Override here if you want to test another inbox
      subject: 'SmartSlot - Server Systems Verification',
      html: '<h2>Success!</h2><p>Your Gmail logic mapped effectively inside NodeJS.</p>'
    });
  } catch(e) { /* Error trapped above */ }
}

module.exports = sendEmail;
