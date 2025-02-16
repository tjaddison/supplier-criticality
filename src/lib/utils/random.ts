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
  return getRandomInt(10000, 10000000)
}

export function calculateCriticalityScore(supplier: any): number {
  // Mock calculation - in reality this would use the weights and actual data
  return getRandomInt(1, 100)
} 