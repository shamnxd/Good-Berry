const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "",
    pass: "",
  },
});


const SendVerificationCode = async (email, code) => {
    console.log("Verification code: ", email, code)
    try {
        const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 10px;">
                <h1 style="color: #333; font-weight: bold; margin-bottom: 20px;">Good Berry</h1>
                <h2 style="color: #333; font-weight: bold; margin-bottom: 10px;">Let’s log you in</h2>
                <p style="color: #555; margin-bottom: 20px;">
                    Use this code to sign up to Transmit Security.<br />
                    This code will expire in 5 minutes.
                </p>
                <div style="font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0; color: #000;">
                    ${code.toString().split('').join(' ')}
                </div>
                <p style="color: #555; margin-bottom: 20px;">
                    This code will securely log you in using<br />
                    <span style="color: #000; font-weight: bold;">${email}</span>
                </p>
                <p style="color: #aaa; font-size: 12px;">
                    If you didn’t request this email, you can safely ignore it.
                </p>
            </div>
        </div>`;

        const response = await transporter.sendMail({
            from: '"Good Berry" <shamnadthayyil8@gmail.com>',
            to: email,
            subject: "Verify your account",
            html: htmlTemplate,
        });

        console.log("Message sent successfully", response);
    } catch (error) {
        console.log(error);
    }
};

const SendWelcomeMessage = async (email) => {
    try {
        const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 10px;">
                <h1 style="color: #333; font-weight: bold; margin-bottom: 10px;">Welcome to Good Berry!</h1>
                <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                    We're excited to have you as part of our community! At Good Berry, we aim to bring you the best experience possible.
                </p>
                <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
                    Feel free to explore our offerings and let us know how we can help you. If you have any questions, we're here to assist.
                </p>
                <a href="" style="display: inline-block; background-color:rgb(162,208,100); color: white; text-decoration: none; padding: 10px 20px; border-radius: 50px; font-size: 16px; font-weight: bold;">
                    Visit Now
                </a>
                <p style="color: #aaa; font-size: 12px; margin-top: 30px;">
                    If you didn’t sign up for Good Berry, you can safely ignore this email.
                </p>
            </div>
        </div>`;

        const response = await transporter.sendMail({
            from: '"Good Berry" <shamnadthayyil8@gmail.com>',
            to: email,
            subject: "Welcome to Good Berry",
            html: htmlTemplate,
        });

        console.log("Message sent successfully", response);
    } catch (error) {
        console.log(error);
    }
};

const SendResetPasswordLink = async (email, resetLink) => {
    try {
        const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 10px;">
                <h1 style="color: #333; font-weight: bold; margin-bottom: 10px;">Reset Your Password</h1>
                <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                    We received a request to reset your password. Click the link below to reset your password:
                </p>
                <a href="${resetLink}" style="display: inline-block; background-color:rgb(162,208,100); color: white; text-decoration: none; padding: 10px 20px; border-radius: 50px; font-size: 16px; font-weight: bold;">
                    Reset Password
                </a>
                <p style="color: #aaa; font-size: 12px; margin-top: 30px;">
                    If you didn’t request this email, you can safely ignore it.
                </p>
            </div>
        </div>`;

        const response = await transporter.sendMail({
            from: '"Good Berry" <shamnadthayyil8@gmail.com>',
            to: email,
            subject: "Reset Password",
            html: htmlTemplate,
        });

        console.log("Message sent successfully", response);
    } catch (error) {
        console.log(error);
    }
};

module.exports = { SendVerificationCode, SendWelcomeMessage, SendResetPasswordLink };
