export interface UploadAuditLog {
  id: string
  userId: string
  filename: string
  uploadDate: string
  uploadDuration: number
  recordsAttempted: number
  recordsSuccessful: number
  recordsFailed: number
  status: 'completed' | 'failed' | 'in_progress'
  errorDetails?: string[]
  validationErrors?: ValidationError[]
  criticialityScoresRecalculated: boolean
  previousRecordCount: number
  newRecordCount: number
}

export interface ValidationError {
  row: number
  field: string
  value: string
  error: string
}

export interface UserRole {
  role: 'free' | 'tier-1' | 'tier-2' | 'tier-3' | 'tier-4'
  maxSuppliers: number
}

export interface CSVSupplierData {
  name: string
  category: string
  subcategory: string
  expirationDate: string
  contractNumber: string
  threeYearSpend: number
  contractDescription?: string
}

export const ROLE_LIMITS: Record<string, number> = {
  'free': 5,
  'tier-1': 200,
  'tier-2': 500,
  'tier-3': 1500,
  'tier-4': Infinity
}

export const CSV_REQUIRED_HEADERS = [
  'name',
  'category',
  'subcategory',
  'expirationDate',
  'contractNumber',
  'threeYearSpend'
] as const

export const CSV_OPTIONAL_HEADERS = [
  'contractDescription'
] as const

export type CSVHeader = typeof CSV_REQUIRED_HEADERS[number] | typeof CSV_OPTIONAL_HEADERS[number]