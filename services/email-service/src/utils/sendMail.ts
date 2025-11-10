import nodemailer from "nodemailer";

import type { SendMailOptions, Transporter } from "nodemailer";
import app from "../app.js";

let transporter: Transporter;

function createTransporter(): Transporter {
  return nodemailer.createTransport({
    host: app.config.SMTP_HOST,
    port: app.config.SMTP_PORT,
    auth: {
      user: app.config.SMTP_USER,
      pass: app.config.SMTP_PASS,
    },
  });
}

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
}

async function sendMail({ from, to, html, subject, ...rest }: SendMailOptions) {
  try {
    const result = await getTransporter().sendMail({
      from,
      to,
      subject,
      html,
      ...rest,
    });

    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export default sendMail;
