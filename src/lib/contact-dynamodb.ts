import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
  DynamoDBDocumentClient, 
  ScanCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand
} from '@aws-sdk/lib-dynamodb';

// Initialize DynamoDB clients
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.CONTACTS_TABLE_NAME || 'ProcureSciContacts';

// Interface for contact submissions
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'closed';
  notes?: string;
}

// Get all contact submissions
export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
  });
  
  const response = await docClient.send(command);
  return response.Items as ContactSubmission[];
}

// Get a single contact submission
export async function getContactSubmission(id: string) {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { id },
  });
  
  const response = await docClient.send(command);
  return response.Item as ContactSubmission;
}

// Update contact status
export async function updateContactStatus(
  id: string, 
  status: 'new' | 'contacted' | 'closed', 
  notes?: string
) {
  const updateExpression = notes 
    ? 'SET #status = :status, #notes = :notes' 
    : 'SET #status = :status';
    
  const expressionAttributeNames: Record<string, string> = {
    '#status': 'status',
  };
  
  const expressionAttributeValues: Record<string, string> = {
    ':status': status,
  };
  
  if (notes) {
    expressionAttributeNames['#notes'] = 'notes';
    expressionAttributeValues[':notes'] = notes;
  }
  
  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  });
  
  return docClient.send(command);
}

// Delete a contact submission
export async function deleteContactSubmission(id: string) {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { id },
  });
  
  return docClient.send(command);
} 