import { 
  DynamoDBClient, 
  CreateTableCommand, 
  ScalarAttributeType,
  KeyType
} from "@aws-sdk/client-dynamodb"
import dotenv from 'dotenv'

// Add proper error type
type DynamoDBError = {
  name: string
  message: string
  code?: string
  statusCode?: number
}

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const client = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || ''
  }
})

async function createTables() {
  // Create suppliers table
  try {
    const suppliersTableParams = {
      TableName: "suppliers",
      KeySchema: [
        { AttributeName: "userId", KeyType: KeyType.HASH },
        { AttributeName: "id", KeyType: KeyType.RANGE }
      ],
      AttributeDefinitions: [
        { AttributeName: "userId", AttributeType: ScalarAttributeType.S },
        { AttributeName: "id", AttributeType: ScalarAttributeType.S }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 25,
        WriteCapacityUnits: 25
      }
    }

    await client.send(new CreateTableCommand(suppliersTableParams))
    console.log("Created suppliers table")
  } catch (error) {
    const dbError = error as DynamoDBError
    if (dbError.name === 'ResourceInUseException') {
      console.log('Suppliers table already exists')
    } else {
      console.error('Error creating suppliers table:', dbError.message)
    }
  }

  // Create criteria weights table
  try {
    const weightsTableParams = {
      TableName: "criteriaweights",
      KeySchema: [
        { AttributeName: "userId", KeyType: KeyType.HASH }
      ],
      AttributeDefinitions: [
        { AttributeName: "userId", AttributeType: ScalarAttributeType.S }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 25,
        WriteCapacityUnits: 25
      }
    }

    await client.send(new CreateTableCommand(weightsTableParams))
    console.log("Created criteria weights table")
  } catch (error) {
    const dbError = error as DynamoDBError
    if (dbError.name === 'ResourceInUseException') {
      console.log('Criteria weights table already exists')
    } else {
      console.error('Error creating criteria weights table:', dbError.message)
    }
  }

  console.log("Table creation process completed")
}

createTables() 