import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { 
  DynamoDBDocumentClient, 
  GetCommand, 
  PutCommand, 
  QueryCommand,
  DeleteCommand,
  UpdateCommand,
  ScanCommand
} from "@aws-sdk/lib-dynamodb"
import { Supplier } from "@/types/supplier"
import { v4 as uuidv4 } from 'uuid'

// Initialize the DynamoDB client
const client = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || ''
  }
})

export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
})

// Supplier CRUD operations
export async function getSuppliers(userId: string) {
  try {
    const command = new QueryCommand({
      TableName: "suppliers",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId
      }
    })

    const response = await docClient.send(command)
    return response.Items as Supplier[]
  } catch (error: unknown) {
    // Check if the error is ResourceNotFoundException (table doesn't exist)
    if (error instanceof Error && error.name === 'ResourceNotFoundException') {
      console.log("Suppliers table not found, returning empty array")
      return []
    }

    console.error("Error fetching suppliers:", error)
    // Return empty array on other errors
    return []
  }
}

export async function createSupplier(supplier: Supplier, userId: string = "user123") {
  try {
    const newSupplier = {
      ...supplier,
      userId,
      id: supplier.id || uuidv4(),
      createdAt: new Date().toISOString()
    }

    const command = new PutCommand({
      TableName: "suppliers",
      Item: newSupplier
    })

    await docClient.send(command)
    return newSupplier
  } catch (error) {
    console.error("Error creating supplier:", error)
    throw error
  }
}

export async function updateSupplier(supplier: Supplier, userId: string = "user123") {
  try {
    const command = new UpdateCommand({
      TableName: "suppliers",
      Key: {
        userId,
        id: supplier.id
      },
      UpdateExpression: "set #name = :name, category = :category, subcategory = :subcategory, expirationDate = :expirationDate, contractNumber = :contractNumber, threeYearSpend = :threeYearSpend, contractDescription = :contractDescription, criticalityScore = :criticalityScore, updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#name": "name" // name is a reserved word in DynamoDB
      },
      ExpressionAttributeValues: {
        ":name": supplier.name,
        ":category": supplier.category,
        ":subcategory": supplier.subcategory,
        ":expirationDate": supplier.expirationDate,
        ":contractNumber": supplier.contractNumber,
        ":threeYearSpend": supplier.threeYearSpend,
        ":contractDescription": supplier.contractDescription || "",
        ":criticalityScore": supplier.criticalityScore,
        ":updatedAt": new Date().toISOString()
      },
      ReturnValues: "ALL_NEW"
    })

    const response = await docClient.send(command)
    return response.Attributes as Supplier
  } catch (error) {
    console.error("Error updating supplier:", error)
    throw error
  }
}

export async function deleteSupplier(id: string, userId: string = "user123") {
  try {
    const command = new DeleteCommand({
      TableName: "suppliers",
      Key: {
        userId,
        id
      }
    })

    await docClient.send(command)
    return { id, deleted: true }
  } catch (error) {
    console.error("Error deleting supplier:", error)
    throw error
  }
}

// Criteria Weights operations
export async function getCriteriaWeights(userId: string) {
  try {
    const command = new GetCommand({
      TableName: "criteriaweights",
      Key: {
        userId
      }
    })

    const response = await docClient.send(command)
    return response.Item
  } catch (error: unknown) {
    // Check if the error is ResourceNotFoundException (table doesn't exist)
    if (error instanceof Error && error.name === 'ResourceNotFoundException') {
      console.log("Criteria weights table not found, returning default weights")
      // Return default weights structure when table doesn't exist
      return {
        spendPercentage: 20,
        threeYearAverage: 20,
        marketSize: 15,
        replacementComplexity: 15,
        utilization: 15,
        riskLevel: 15
      }
    }

    console.error("Error fetching criteria weights:", error)
    // Return null on other errors
    return null
  }
}

// Add proper type for weights
interface CriteriaWeights {
  spendPercentage: number
  threeYearAverage: number
  marketSize: number
  replacementComplexity: number
  utilization: number
  riskLevel: number
}

export async function updateCriteriaWeights(userId: string, weights: CriteriaWeights) {
  try {
    const command = new PutCommand({
      TableName: "criteriaweights",
      Item: {
        userId,
        ...weights
      }
    })

    await docClient.send(command)
    return { success: true }
  } catch (error: unknown) {
    // Check if the error is ResourceNotFoundException (table doesn't exist)
    if (error instanceof Error && error.name === 'ResourceNotFoundException') {
      console.warn("Criteria weights table not found, weights update skipped")
      // Return success even if table doesn't exist for now
      // In production, you would want to create the table or handle this differently
      return { success: true, warning: "Table not found, update skipped" }
    }

    console.error("Error updating criteria weights:", error)
    throw error
  }
}

// Add this function to get unique subcategories
export async function getUniqueSubcategories(userId: string): Promise<{ [category: string]: string[] }> {
  try {
    const command = new ScanCommand({
      TableName: "suppliers",
      FilterExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId
      }
    });

    const response = await docClient.send(command);
    const items = response.Items || [];

    // Create a map to store unique subcategories for each category
    const subcategoriesMap: { [category: string]: Set<string> } = {};

    items.forEach(item => {
      const category = item.category || '';
      const subcategory = item.subcategory || '';

      if (!subcategoriesMap[category]) {
        subcategoriesMap[category] = new Set();
      }
      subcategoriesMap[category].add(subcategory);
    });

    // Convert Sets to arrays
    return Object.entries(subcategoriesMap).reduce((acc, [category, subcategories]) => {
      acc[category] = Array.from(subcategories);
      return acc;
    }, {} as { [category: string]: string[] });

  } catch (error: unknown) {
    // Check if the error is ResourceNotFoundException (table doesn't exist)
    if (error instanceof Error && error.name === 'ResourceNotFoundException') {
      console.log("Suppliers table not found, returning empty subcategories map")
      return {}
    }

    console.error('Error getting unique subcategories:', error);
    return {};
  }
} 