const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1.) Create a transporter (service that will send the email, like gmail for example)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // TODO: Activate in gmail 'less secure app' option if using gmail
  });

  // 2.) Define the email options
  const mailOptions = {
    from: 'Senior Project <hello@seniorproject.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };
  // 3.) Actually send the email with nodemailer
  await transporter.sendMail(mailOptions); // returns a promise
};

module.exports = sendEmail;
