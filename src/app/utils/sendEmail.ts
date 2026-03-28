// /* eslint-disable @typescript-eslint/no-explicit-any */
// import ejs from "ejs";
// import nodemailer from "nodemailer";
// import path from "path";
// import { envVars } from "../config/env";
// import AppError from "../errorHelpers/AppError";

// const transporter = nodemailer.createTransport({
//     secure: true,
//     auth: {
//         user: envVars.EMAIL_SENDER.SMTP_USER,
//         pass: envVars.EMAIL_SENDER.SMTP_PASS
//     },
//     port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
//     host: envVars.EMAIL_SENDER.SMTP_HOST
// })

// interface SendEmailOptions {
//     to: string,
//     subject: string;
//     templateName: string;
//     templateData?: Record<string, any>
//     attachments?: {
//         filename: string,
//         content: Buffer | string,
//         contentType: string
//     }[]
// }

// export const sendEmail = async ({
//     to,
//     subject,
//     templateName,
//     templateData,
//     attachments
// }: SendEmailOptions) => {
//     try {
//         console.log({ to, subject, templateName, templateData, attachments });
//         const templatePath = path.join(__dirname, `templates/${templateName}.ejs`)
//         const html = await ejs.renderFile(templatePath, templateData)
//         const info = await transporter.sendMail({
//             from: envVars.EMAIL_SENDER.SMTP_FROM,
//             to: to,
//             subject: subject,
//             html: html,
//             attachments: attachments?.map(attachment => ({
//                 filename: attachment.filename,
//                 content: attachment.content,
//                 contentType: attachment.contentType
//             }))
//         })
//         console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
//     } catch (error: any) {
//         console.log("email sending error", error.message);
//         throw new AppError(401, "Email error")
//     }
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
  secure: Number(envVars.EMAIL_SENDER.SMTP_PORT) === 465, // true for 465, false for 587
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS, // Use Gmail App Password if using Gmail
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: SendEmailOptions) => {
  try {
    // Render the EJS template
    const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData || {});

    // Send mail
    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });

    console.log(`✉️ Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error: any) {
    console.error("Email sending error:", error.message);
    throw new AppError(500, "Failed to send email. Please check SMTP configuration.");
  }
};