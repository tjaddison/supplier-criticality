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
  const command = new QueryCommand({
    TableName: "suppliers",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId
    }
  })

  const response = await docClient.send(command)
  return response.Items as Supplier[]
}

export async function createSupplier(userId: string, supplier: Supplier) {
  const command = new PutCommand({
    TableName: "suppliers",
    Item: {
      userId,
      ...supplier
    }
  })

  return docClient.send(command)
}

export async function updateSupplier(userId: string, supplier: Supplier) {
  const command = new UpdateCommand({
    TableName: "suppliers",
    Key: {
      userId,
      id: supplier.id
    },
    UpdateExpression: "set #name = :name, category = :category, subcategory = :subcategory, expirationDate = :expirationDate, contractNumber = :contractNumber, threeYearSpend = :threeYearSpend, contractDescription = :contractDescription, criticalityScore = :criticalityScore",
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
      ":contractDescription": supplier.contractDescription,
      ":criticalityScore": supplier.criticalityScore
    }
  })

  try {
    const response = await docClient.send(command)
    console.log('Update successful:', response)
    return response
  } catch (error) {
    console.error('Error updating supplier:', error)
    throw error
  }
}

export async function deleteSupplier(userId: string, supplierId: string) {
  const command = new DeleteCommand({
    TableName: "suppliers",
    Key: {
      userId,
      id: supplierId
    }
  })

  return docClient.send(command)
}

// Criteria Weights operations
export async function getCriteriaWeights(userId: string) {
  const command = new GetCommand({
    TableName: "criteriaweights",
    Key: {
      userId
    }
  })

  const response = await docClient.send(command)
  return response.Item
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
  const command = new PutCommand({
    TableName: "criteriaweights",
    Item: {
      userId,
      ...weights
    }
  })

  return docClient.send(command)
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

  } catch (error) {
    console.error('Error getting unique subcategories:', error);
    throw error;
  }
} 