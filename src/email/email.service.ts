import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';


@Injectable()
export class EmailService {
    private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // You can replace this with any other email provider
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password or App Password if using Gmail
      },
    });
  }

  async sendMail(to: string, subject: string, html?: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender's address
      to, // List of recipients
      subject, // Subject line
      html, // HTML body (optional)
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
