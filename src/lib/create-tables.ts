import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb"

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
})

async function createTables() {
  // Create suppliers table
  const suppliersTable = new CreateTableCommand({
    TableName: "suppliers",
    AttributeDefinitions: [
      { AttributeName: "userId", AttributeType: "S" },
      { AttributeName: "id", AttributeType: "S" }
    ],
    KeySchema: [
      { AttributeName: "userId", KeyType: "HASH" },
      { AttributeName: "id", KeyType: "RANGE" }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  })

  // Create criteriaweights table
  const weightsTable = new CreateTableCommand({
    TableName: "criteriaweights",
    AttributeDefinitions: [
      { AttributeName: "userId", AttributeType: "S" }
    ],
    KeySchema: [
      { AttributeName: "userId", KeyType: "HASH" }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  })

  // Create upload audit logs table
  const uploadAuditTable = new CreateTableCommand({
    TableName: "upload_audit_logs",
    AttributeDefinitions: [
      { AttributeName: "userId", AttributeType: "S" },
      { AttributeName: "id", AttributeType: "S" }
    ],
    KeySchema: [
      { AttributeName: "userId", KeyType: "HASH" },
      { AttributeName: "id", KeyType: "RANGE" }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  })

  try {
    await client.send(suppliersTable)
    await client.send(weightsTable)
    await client.send(uploadAuditTable)
    console.log("Tables created successfully")
  } catch (error) {
    console.error("Error creating tables:", error)
  }
}

createTables() 