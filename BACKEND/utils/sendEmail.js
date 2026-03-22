import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'IIC Email Verification',
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>IIC Innovation Platform - Email Verification</h2>
        <p>Your OTP is: <strong style="font-size: 24px; letter-spacing: 4px;">${otp}</strong></p>
        <p>Valid for 10 minutes.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendAdminLoginAlert = async (email, loginTime, ipAddress = '') => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Admin Login Alert',
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Admin Login Alert</h2>
        <p>Hello Admin,</p>
        <p>Your IIC Platform admin account was accessed successfully.</p>
        <p><strong>Login Time:</strong> ${loginTime}</p>
        ${ipAddress ? `<p><strong>IP Address:</strong> ${ipAddress}</p>` : ''}
        <p>If this was not you, please change your password immediately.</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};
