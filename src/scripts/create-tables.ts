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
  try {
    // Create suppliers table
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
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    }

    await client.send(new CreateTableCommand(suppliersTableParams))
    console.log("Created suppliers table")

    // Create criteria weights table
    const weightsTableParams = {
      TableName: "criteriaweights",
      KeySchema: [
        { AttributeName: "userId", KeyType: KeyType.HASH }
      ],
      AttributeDefinitions: [
        { AttributeName: "userId", AttributeType: ScalarAttributeType.S }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    }

    await client.send(new CreateTableCommand(weightsTableParams))
    console.log("Created criteria weights table")

  } catch (error) {
    const dbError = error as DynamoDBError
    if (dbError.code === 'ResourceInUseException') {
      console.log('Tables already exist')
    } else {
      console.error('Error creating tables:', dbError.message)
      throw error
    }
  }
}

createTables() 