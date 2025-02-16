export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function getRandomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date.toISOString().split('T')[0]
}

export function getRandomSpend(): number {
  // Generate spend between $10,000 and $10,000,000
  return Math.floor(Math.random() * (10000000 - 10000 + 1)) + 10000
}

export function calculateCriticalityScore(): number {
  // TODO: Implement actual criticality calculation based on weights and supplier data
  // For now, return a random score between 0 and 100
  return Math.floor(Math.random() * 100)
} 