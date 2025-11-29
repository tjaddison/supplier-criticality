import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { sendContactFormEmail } from '@/lib/email';

// Initialize DynamoDB clients
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const docClient = DynamoDBDocumentClient.from(client);

export async function POST(request: Request) {
  try {
    const { name, email, company } = await request.json();

    // Basic validation
    if (!name || !email || !company) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Create a unique ID for this contact submission
    const id = uuidv4();
    const timestamp = new Date().toISOString();

    // Save to DynamoDB
    await docClient.send(
      new PutCommand({
        TableName: process.env.CONTACTS_TABLE_NAME || 'procuresci-contacts',
        Item: {
          id,
          name,
          email,
          company,
          createdAt: timestamp,
          status: 'new', // For tracking follow-up status
        },
      })
    );

    // Send email notification (non-blocking - don't fail if email fails)
    try {
      await sendContactFormEmail({
        name,
        email,
        company,
        timestamp,
      });
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('Failed to send contact form email notification:', emailError);
      // Contact is still saved to database, so we don't throw
    }

    return NextResponse.json(
      { message: 'Contact information received successfully!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Failed to save contact form data:', error);
    return NextResponse.json(
      { message: 'Failed to process your request' }, 
      { status: 500 }
    );
  }
} 