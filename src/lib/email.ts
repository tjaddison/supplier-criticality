import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface ContactFormEmailData {
  name: string;
  email: string;
  company: string;
  timestamp: string;
}

/**
 * Creates an AWS SES client
 * Returns null if credentials are not configured
 */
function createSESClient() {
  const awsRegion = process.env.AWS_REGION || 'us-east-1';
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  // Check if AWS credentials are configured
  if (!accessKeyId || !secretAccessKey) {
    console.warn('AWS credentials not configured. Emails will be logged to console only.');
    return null;
  }

  return new SESClient({
    region: awsRegion,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Sends an email using AWS SES
 * If SES is not configured, logs the email to console
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  const from = process.env.EMAIL_FROM || 'noreply@procuresci.com';
  const sesClient = createSESClient();

  if (!sesClient) {
    // Development mode - log email to console
    console.log('=== EMAIL (Development Mode) ===');
    console.log(`From: ${from}`);
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Text:\n${options.text}`);
    if (options.html) {
      console.log(`HTML:\n${options.html}`);
    }
    console.log('================================');
    return;
  }

  try {
    const command = new SendEmailCommand({
      Source: from,
      Destination: {
        ToAddresses: [options.to],
      },
      Message: {
        Subject: {
          Data: options.subject,
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: options.text,
            Charset: 'UTF-8',
          },
          ...(options.html && {
            Html: {
              Data: options.html,
              Charset: 'UTF-8',
            },
          }),
        },
      },
    });

    const response = await sesClient.send(command);
    console.log('Email sent successfully via AWS SES:', response.MessageId);
  } catch (error) {
    console.error('Failed to send email via AWS SES:', error);
    // Re-throw the error so calling code can handle it
    throw error;
  }
}

/**
 * Sends a notification email for a new contact form submission
 */
export async function sendContactFormEmail(data: ContactFormEmailData): Promise<void> {
  const recipientEmail = process.env.CONTACT_EMAIL_TO;

  if (!recipientEmail) {
    console.warn('CONTACT_EMAIL_TO not configured. Contact form email not sent.');
    return;
  }

  const subject = 'New Contact Form Submission - ProcureSci';

  const text = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Company: ${data.company}
Submitted: ${new Date(data.timestamp).toLocaleString('en-US', {
  dateStyle: 'full',
  timeStyle: 'long',
  timeZone: 'America/New_York'
})}

---
This is an automated notification from ProcureSci Contact Form.
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #2D2D2D;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #194866 0%, #3CDBDD 100%);
      color: white;
      padding: 30px;
      border-radius: 8px 8px 0 0;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-top: none;
      padding: 30px;
      border-radius: 0 0 8px 8px;
    }
    .field {
      margin-bottom: 20px;
    }
    .field-label {
      font-weight: 600;
      color: #194866;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    .field-value {
      font-size: 16px;
      color: #2D2D2D;
      padding: 10px;
      background: #f0f9fa;
      border-radius: 4px;
      border-left: 3px solid #3CDBDD;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>New Contact Form Submission</h1>
  </div>
  <div class="content">
    <div class="field">
      <div class="field-label">Full Name</div>
      <div class="field-value">${data.name}</div>
    </div>
    <div class="field">
      <div class="field-label">Email Address</div>
      <div class="field-value"><a href="mailto:${data.email}" style="color: #194866; text-decoration: none;">${data.email}</a></div>
    </div>
    <div class="field">
      <div class="field-label">Company / Organization</div>
      <div class="field-value">${data.company}</div>
    </div>
    <div class="field">
      <div class="field-label">Submitted</div>
      <div class="field-value">${new Date(data.timestamp).toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'long',
        timeZone: 'America/New_York'
      })}</div>
    </div>
    <div class="footer">
      This is an automated notification from ProcureSci Contact Form.
    </div>
  </div>
</body>
</html>
  `.trim();

  await sendEmail({
    to: recipientEmail,
    subject,
    text,
    html,
  });
}
