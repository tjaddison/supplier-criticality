import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, company } = await request.json();

    // Validate input
    if (!name || !email || !company) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Configure Nodemailer transporter
    // IMPORTANT: Use environment variables for sensitive credentials
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // e.g., smtp.example.com
      port: parseInt(process.env.EMAIL_PORT || '587', 10), // e.g., 587 or 465
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Your sending email address (e.g., noreply@procuresci.com or info@procuresci.com)
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });

    // Email options
    const mailOptions = {
      from: `"ProcureSci Contact Form" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`, // Sender address (display name + email)
      to: 'info@procuresci.com', // <<< Update recipient email here
      replyTo: email, // Set the reply-to field to the user's email
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h1>New Contact Request</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });

  } catch (error) {
    console.error('Error sending email:', error);
    // It's good practice to avoid exposing detailed error messages to the client
    return NextResponse.json({ message: 'Failed to send email. Please try again later.' }, { status: 500 });
  }
} 