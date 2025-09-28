import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  DeleteCommand,
  UpdateCommand
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

// Default supplier data template for new users
const DEFAULT_SUPPLIERS = [
  {
    id: "1",
    name: "TechCorp Solutions",
    category: "Technology",
    subcategory: "Software Development",
    expirationDate: "2025-12-31",
    contractNumber: "TC-2024-001",
    threeYearSpend: 2500000,
    criticalityScore: 85,
    contractDescription: "Enterprise software development and maintenance services"
  },
  {
    id: "2",
    name: "SecureNet Services",
    category: "Technology",
    subcategory: "Cybersecurity",
    expirationDate: "2026-06-30",
    contractNumber: "SN-2024-002",
    threeYearSpend: 1800000,
    criticalityScore: 92,
    contractDescription: "Comprehensive cybersecurity monitoring and incident response"
  },
  {
    id: "3",
    name: "CloudMax Infrastructure",
    category: "Technology",
    subcategory: "Cloud Services",
    expirationDate: "2025-09-15",
    contractNumber: "CM-2024-003",
    threeYearSpend: 3200000,
    criticalityScore: 88,
    contractDescription: "Cloud infrastructure hosting and management services"
  },
  {
    id: "4",
    name: "DataFlow Analytics",
    category: "Technology",
    subcategory: "Data Analytics",
    expirationDate: "2025-03-31",
    contractNumber: "DF-2024-004",
    threeYearSpend: 1200000,
    criticalityScore: 76,
    contractDescription: "Business intelligence and data analytics platform"
  },
  {
    id: "5",
    name: "GlobalComm Networks",
    category: "Communications",
    subcategory: "Telecommunications",
    expirationDate: "2027-01-15",
    contractNumber: "GC-2024-005",
    threeYearSpend: 950000,
    criticalityScore: 82,
    contractDescription: "Enterprise telecommunications and network services"
  },
  {
    id: "6",
    name: "Facilities Pro Services",
    category: "Facilities",
    subcategory: "Maintenance",
    expirationDate: "2025-11-30",
    contractNumber: "FP-2024-006",
    threeYearSpend: 750000,
    criticalityScore: 68,
    contractDescription: "Building maintenance and facility management services"
  },
  {
    id: "7",
    name: "TransLogistics Corp",
    category: "Logistics",
    subcategory: "Transportation",
    expirationDate: "2026-08-31",
    contractNumber: "TL-2024-007",
    threeYearSpend: 1600000,
    criticalityScore: 79,
    contractDescription: "Freight and transportation logistics services"
  },
  {
    id: "8",
    name: "EnergyPlus Solutions",
    category: "Utilities",
    subcategory: "Energy Management",
    expirationDate: "2025-05-31",
    contractNumber: "EP-2024-008",
    threeYearSpend: 2100000,
    criticalityScore: 84,
    contractDescription: "Energy management and optimization services"
  },
  {
    id: "9",
    name: "LegalAdvise Partners",
    category: "Professional Services",
    subcategory: "Legal",
    expirationDate: "2025-12-31",
    contractNumber: "LA-2024-009",
    threeYearSpend: 850000,
    criticalityScore: 71,
    contractDescription: "Legal advisory and compliance services"
  },
  {
    id: "10",
    name: "FinanceMax Consulting",
    category: "Professional Services",
    subcategory: "Financial Advisory",
    expirationDate: "2026-02-28",
    contractNumber: "FM-2024-010",
    threeYearSpend: 1400000,
    criticalityScore: 77,
    contractDescription: "Financial advisory and accounting services"
  }
]

// User-specific supplier operations
export async function getUserSuppliers(userId: string) {
  try {
    const command = new QueryCommand({
      TableName: "suppliers",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId
      }
    })

    const response = await docClient.send(command)

    if (response.Items && response.Items.length > 0) {
      return response.Items.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        subcategory: item.subcategory,
        expirationDate: item.expirationDate,
        contractNumber: item.contractNumber,
        threeYearSpend: item.threeYearSpend,
        criticalityScore: item.criticalityScore || 0,
        contractDescription: item.contractDescription
      }))
    } else {
      // If no suppliers found, initialize with default data for this user
      await initializeUserSuppliers(userId)
      return DEFAULT_SUPPLIERS
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'ResourceNotFoundException') {
      console.log("Suppliers table not found, returning default data")
      return DEFAULT_SUPPLIERS
    }
    console.error("Error fetching user suppliers:", error)
    return DEFAULT_SUPPLIERS
  }
}

export async function initializeUserSuppliers(userId: string) {
  try {
    const putPromises = DEFAULT_SUPPLIERS.map(supplier => {
      const command = new PutCommand({
        TableName: "suppliers",
        Item: {
          userId: userId,
          id: supplier.id,
          name: supplier.name,
          category: supplier.category,
          subcategory: supplier.subcategory,
          expirationDate: supplier.expirationDate,
          contractNumber: supplier.contractNumber,
          threeYearSpend: supplier.threeYearSpend,
          criticalityScore: supplier.criticalityScore,
          contractDescription: supplier.contractDescription,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      })
      return docClient.send(command)
    })

    await Promise.all(putPromises)
    console.log(`Initialized ${DEFAULT_SUPPLIERS.length} suppliers for user ${userId}`)
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'ResourceNotFoundException') {
      console.warn("Suppliers table not found, skipping initialization")
    } else {
      console.error("Error initializing user suppliers:", error)
    }
  }
}

// Legacy function for backward compatibility - now user-specific
export function getSuppliers() {
  // This function should not be used directly anymore
  // It returns the default data for backward compatibility during migration
  console.warn("getSuppliers() is deprecated, use getUserSuppliers(userId) instead")
  return DEFAULT_SUPPLIERS
}

// Supplier CRUD operations
export async function createSupplier(supplier: Supplier, userId: string) {
  try {
    const newSupplier = {
      ...supplier,
      userId,
      id: supplier.id || uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const command = new PutCommand({
      TableName: "suppliers",
      Item: newSupplier
    })

    await docClient.send(command)
    return {
      id: newSupplier.id,
      name: newSupplier.name,
      category: newSupplier.category,
      subcategory: newSupplier.subcategory,
      expirationDate: newSupplier.expirationDate,
      contractNumber: newSupplier.contractNumber,
      threeYearSpend: newSupplier.threeYearSpend,
      criticalityScore: newSupplier.criticalityScore || 0,
      contractDescription: newSupplier.contractDescription
    }
  } catch (error) {
    console.error("Error creating supplier:", error)
    throw error
  }
}

export async function updateSupplier(supplier: Supplier, userId: string) {
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
    const updated = response.Attributes
    return {
      id: updated?.id,
      name: updated?.name,
      category: updated?.category,
      subcategory: updated?.subcategory,
      expirationDate: updated?.expirationDate,
      contractNumber: updated?.contractNumber,
      threeYearSpend: updated?.threeYearSpend,
      criticalityScore: updated?.criticalityScore || 0,
      contractDescription: updated?.contractDescription
    }
  } catch (error) {
    console.error("Error updating supplier:", error)
    throw error
  }
}

export async function deleteSupplier(id: string, userId: string) {
  try {
    const command = new DeleteCommand({
      TableName: "suppliers",
      Key: {
        userId,
        id: id
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
        threeYearAverage: 30,
        marketSize: 5,
        replacementComplexity: 10,
        utilization: 10,
        riskLevel: 25
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

// Get unique subcategories from user-specific data
export async function getUserUniqueSubcategories(userId: string): Promise<{ [category: string]: string[] }> {
  const suppliers = await getUserSuppliers(userId)
  const subcategoriesMap: { [category: string]: Set<string> } = {}

  suppliers.forEach(supplier => {
    const category = supplier.category || ''
    const subcategory = supplier.subcategory || ''

    if (!subcategoriesMap[category]) {
      subcategoriesMap[category] = new Set()
    }
    subcategoriesMap[category].add(subcategory)
  })

  // Convert Sets to arrays
  return Object.entries(subcategoriesMap).reduce((acc, [category, subcategories]) => {
    acc[category] = Array.from(subcategories)
    return acc
  }, {} as { [category: string]: string[] })
}

// Legacy function for backward compatibility
export function getUniqueSubcategories(): { [category: string]: string[] } {
  console.warn("getUniqueSubcategories() is deprecated, use getUserUniqueSubcategories(userId) instead")
  const suppliers = DEFAULT_SUPPLIERS
  const subcategoriesMap: { [category: string]: Set<string> } = {}

  suppliers.forEach(supplier => {
    const category = supplier.category || ''
    const subcategory = supplier.subcategory || ''

    if (!subcategoriesMap[category]) {
      subcategoriesMap[category] = new Set()
    }
    subcategoriesMap[category].add(subcategory)
  })

  // Convert Sets to arrays
  return Object.entries(subcategoriesMap).reduce((acc, [category, subcategories]) => {
    acc[category] = Array.from(subcategories)
    return acc
  }, {} as { [category: string]: string[] })
} 