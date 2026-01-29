"use strict"

import nodemailer from 'nodemailer';
import { config } from '../../config';

let mail: any = config.MAIL

const option: any = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: mail,
        pass: config.GMAIL_PASSWORD
    }
};
const transPorter = nodemailer.createTransport(option)

export const email_verification_mail = async (user: any, otp: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const mailOptions = {
                from: mail,
                to: user.email,
                subject: "Login OTP - HK DigiSkill",
                html: `
                <html lang="en-US">
                <head>
                    <meta charset="utf-8" />
                    <title>HK DigiSkill - Login OTP</title>
                </head>
                <body style="margin:0; padding:20px; background:#f7f7f7; font-family:Arial, sans-serif;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto; background:#fff; padding:25px; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                        <tr>
                            <td>
                                <p style="font-size:16px; color:#333; margin:0;">
                                    Hi dear,
                                </p>

                                <p style="font-size:15px; color:#555; line-height:24px;">
                                    Someone — hopefully you — is trying to log in to their <strong>HK DigiSkill</strong> account.<br><br>
                                    Your OTP is valid for <strong>10 minutes</strong>.<br><br>
                                    <strong>Login OTP:</strong> <span style="font-size:20px; font-weight:bold; color:#000;">${otp}</span><br><br>
                                    If this was not you, please ignore this email and secure your account.
                                </p>

                                <p style="font-size:15px; color:#333; margin-top:30px;">
                                    Warm Regards,<br>
                                    <strong>Team HK DigiSkill</strong><br>
                                    Powered by <strong>HK DigiVerse LLP</strong><br>
                                    <a href="https://www.hkdigiskill.com" target="_blank" style="color:#1a73e8; text-decoration:none;">
                                        www.hkdigiskill.com
                                    </a>
                                </p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                `,
            };

            await transPorter.sendMail(mailOptions, function (err, data) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(`Email has been sent to ${user.email}`);
                }
            });

        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

export const send_newsletter = async (email: string, subject: string, htmlMessage: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Wrap the HTML message in a proper email template
            const htmlContent = `
                <html lang="en-US">
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>${subject}</title>
                </head>
                <body style="margin:0; padding:20px; background:#f7f7f7; font-family:Arial, sans-serif;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto; background:#fff; padding:25px; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                        <tr>
                            <td>
                                ${htmlMessage}
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `;

            const mailOptions = {
                from: mail,
                to: email,
                subject: subject,
                html: htmlContent,
            };

            await transPorter.sendMail(mailOptions, function (err, data) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve({
                        success: true,
                        message: `Newsletter has been sent to ${email}`,
                        recipients: email
                    });
                }
            });

        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}
