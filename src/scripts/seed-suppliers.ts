import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'
import { 
  getRandomInt, 
  getRandomElement, 
  getRandomDate, 
  getRandomSpend, 
  calculateCriticalityScore 
} from '../lib/utils/random'
import { Supplier } from '../types/supplier'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const client = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || ''
  }
})

const docClient = DynamoDBDocumentClient.from(client)

const categories = ["Hardware", "Software", "Services"]
const subcategories = {
  Hardware: ["Servers", "Networking", "Storage", "Printers", "Workstations"],
  Software: ["Operating Systems", "Security", "Database", "Cloud Services", "Development Tools"],
  Services: ["Consulting", "Support", "Training", "Implementation", "Maintenance"]
}

const companyPrefixes = ["Tech", "Data", "Net", "Sys", "Info", "Cloud", "Cyber", "Digital"]
const companySuffixes = ["Corp", "Solutions", "Systems", "Services", "Technologies", "Group", "Inc", "LLC"]

function generateCompanyName(): string {
  return `${getRandomElement(companyPrefixes)}${getRandomElement(companySuffixes)}`
}

async function seedSuppliers() {
  const userId = "user123" // Demo user ID
  const suppliers: Omit<Supplier, 'userId'>[] = []

  for (let i = 0; i < 23; i++) {
    const category = getRandomElement(categories)
    const supplier: Omit<Supplier, 'userId'> = {
      id: uuidv4(),
      name: generateCompanyName(),
      category,
      subcategory: getRandomElement(subcategories[category as keyof typeof subcategories]),
      expirationDate: getRandomDate(new Date(), new Date('2025-12-31')),
      contractNumber: `CTR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      threeYearSpend: getRandomSpend(),
      contractDescription: `Provider of ${category.toLowerCase()} solutions and services.`,
      criticalityScore: 0
    }
    
    supplier.criticalityScore = calculateCriticalityScore(supplier)
    suppliers.push(supplier)
  }

  try {
    for (const supplier of suppliers) {
      await docClient.send(new PutCommand({
        TableName: "suppliers",
        Item: {
          userId,
          ...supplier
        }
      }))
      console.log(`Added supplier: ${supplier.name}`)
    }
    console.log("Successfully seeded 23 suppliers")
  } catch (error) {
    console.error("Error seeding suppliers:", error)
    throw error
  }
}

seedSuppliers() 