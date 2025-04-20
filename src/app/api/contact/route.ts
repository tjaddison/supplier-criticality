import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, company } = await request.json();

    // Basic validation
    if (!name || !email || !company) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Configure Nodemailer transporter
    // Ensure environment variables are set!
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: Number(process.env.EMAIL_SERVER_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_SENDER_EMAIL,
        pass: process.env.EMAIL_SENDER_PASSWORD,
      },
    });

    // Email options
    const mailOptions = {
      from: `"ProcureSci Contact Form" <${process.env.EMAIL_SENDER_EMAIL}>`, // Sender address (must be authorized)
      to: process.env.EMAIL_RECIPIENT, // List of receivers (your procuresci@gmail.com)
      subject: 'New Contact Form Submission / Demo Request', // Subject line
      text: `
        New contact form submission:

        Name: ${name}
        Email: ${email}
        Company/Organization: ${company}
      `,
      html: `
        <h2>New Contact Form Submission / Demo Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Company/Organization:</strong> ${company}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });

  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
  }
} 