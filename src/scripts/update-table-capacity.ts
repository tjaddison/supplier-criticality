import {
  DynamoDBClient,
  UpdateTableCommand
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

async function updateTableCapacity() {
  const newCapacity = {
    ReadCapacityUnits: 25,
    WriteCapacityUnits: 25
  }

  // Update suppliers table
  try {
    const suppliersUpdateParams = {
      TableName: "suppliers",
      ProvisionedThroughput: newCapacity
    }

    await client.send(new UpdateTableCommand(suppliersUpdateParams))
    console.log("Updated suppliers table capacity to 25 read/write units")
  } catch (error) {
    const dbError = error as DynamoDBError
    if (dbError.name === 'ResourceNotFoundException') {
      console.log('Suppliers table not found')
    } else {
      console.error('Error updating suppliers table:', dbError.message)
    }
  }

  // Update criteria weights table
  try {
    const weightsUpdateParams = {
      TableName: "criteriaweights",
      ProvisionedThroughput: newCapacity
    }

    await client.send(new UpdateTableCommand(weightsUpdateParams))
    console.log("Updated criteria weights table capacity to 25 read/write units")
  } catch (error) {
    const dbError = error as DynamoDBError
    if (dbError.name === 'ResourceNotFoundException') {
      console.log('Criteria weights table not found')
    } else {
      console.error('Error updating criteria weights table:', dbError.message)
    }
  }

  console.log("Table capacity update process completed")
}

updateTableCapacity()