import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb"
import dotenv from 'dotenv'

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
    await client.send(new CreateTableCommand({
      TableName: "suppliers",
      AttributeDefinitions: [
        { AttributeName: "userId", AttributeType: "S" },
        { AttributeName: "id", AttributeType: "S" }
      ],
      KeySchema: [
        { AttributeName: "userId", KeyType: "HASH" },
        { AttributeName: "id", KeyType: "RANGE" }
      ],
      BillingMode: "PAY_PER_REQUEST"
    }))
    console.log("Suppliers table created successfully")

    // Create criteriaweights table
    await client.send(new CreateTableCommand({
      TableName: "criteriaweights",
      AttributeDefinitions: [
        { AttributeName: "userId", AttributeType: "S" }
      ],
      KeySchema: [
        { AttributeName: "userId", KeyType: "HASH" }
      ],
      BillingMode: "PAY_PER_REQUEST"
    }))
    console.log("Criteria weights table created successfully")

  } catch (error: any) {
    // Ignore if tables already exist
    if (error.name === 'ResourceInUseException') {
      console.log("Tables already exist")
    } else {
      console.error("Error creating tables:", error)
      throw error
    }
  }
}

createTables() 