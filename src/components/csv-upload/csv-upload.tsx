"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Upload, Download, AlertCircle, CheckCircle, FileText, Clock } from 'lucide-react'

interface UploadResult {
  success: boolean
  message?: string
  error?: string
  details?: string[]
  validationErrors?: Array<{
    row: number
    field: string
    value: string
    error: string
  }>
  recordsProcessed?: number
  previousCount?: number
  newCount?: number
  uploadDuration?: number
  userRole?: string
  maxSuppliers?: number
  attemptedRecords?: number
}

interface CSVUploadProps {
  onUploadComplete?: () => void
  userRole?: string
  maxSuppliers?: number
}

export function CSVUpload({ onUploadComplete, userRole = 'free', maxSuppliers = 5 }: CSVUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadResult(null)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()

    const files = event.dataTransfer.files
    if (files.length > 0) {
      setSelectedFile(files[0])
      setUploadResult(null)
    }
  }

  const downloadTemplate = async () => {
    try {
      const response = await fetch('/api/suppliers/upload', {
        method: 'GET',
        credentials: 'include'
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = 'supplier-template.csv'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        if (response.status === 401) {
          window.location.href = '/auth/login'
          return
        }
        console.error('Failed to download template')
      }
    } catch (error) {
      console.error('Error downloading template:', error)
    }
  }

  const uploadFile = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)
    setUploadResult(null)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/suppliers/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      if (!response.ok && response.status === 401) {
        clearInterval(progressInterval)
        window.location.href = '/auth/login'
        return
      }

      const result: UploadResult = await response.json()

      clearInterval(progressInterval)
      setUploadProgress(100)

      setUploadResult(result)

      if (result.success && onUploadComplete) {
        onUploadComplete()
      }

    } catch (error) {
      clearInterval(progressInterval)
      setUploadResult({
        success: false,
        error: 'Network error occurred',
        details: [error instanceof Error ? error.message : 'Unknown error']
      })
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 2000)
    }
  }

  const resetUpload = () => {
    setSelectedFile(null)
    setUploadResult(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Supplier Data
        </CardTitle>
        <CardDescription>
          Upload a CSV file to replace all your supplier data. Your current data will be backed up for audit purposes.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Role and Limits Info */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{userRole.toUpperCase()}</Badge>
            <span className="text-sm text-gray-600">
              Max suppliers: {maxSuppliers === Infinity ? 'Unlimited' : maxSuppliers}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadTemplate}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Template
          </Button>
        </div>

        {/* File Upload Area */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors hover:border-gray-400"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div className="space-y-2">
              <FileText className="h-12 w-12 mx-auto text-blue-500" />
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
              <Button variant="outline" size="sm" onClick={resetUpload}>
                Choose Different File
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-12 w-12 mx-auto text-gray-400" />
              <p className="text-sm font-medium">Drop your CSV file here, or click to browse</p>
              <p className="text-xs text-gray-500">Supports .csv files only</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                Browse Files
              </Button>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading and processing...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={uploadFile}
          disabled={!selectedFile || isUploading}
          className="w-full"
          size="lg"
        >
          {isUploading ? 'Processing...' : 'Upload and Replace Supplier Data'}
        </Button>

        {/* Results */}
        {uploadResult && (
          <div className="space-y-4">
            {uploadResult.success ? (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Upload Successful!</AlertTitle>
                <AlertDescription className="text-green-700">
                  <div className="space-y-1">
                    <p>{uploadResult.message}</p>
                    {uploadResult.recordsProcessed && (
                      <p>Processed {uploadResult.recordsProcessed} suppliers</p>
                    )}
                    {uploadResult.previousCount !== undefined && uploadResult.newCount !== undefined && (
                      <p>
                        Previous count: {uploadResult.previousCount} → New count: {uploadResult.newCount}
                      </p>
                    )}
                    {uploadResult.uploadDuration && (
                      <p className="flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        Completed in {(uploadResult.uploadDuration / 1000).toFixed(2)}s
                      </p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800">Upload Failed</AlertTitle>
                <AlertDescription className="text-red-700">
                  <div className="space-y-2">
                    <p>{uploadResult.error}</p>
                    {uploadResult.details && uploadResult.details.length > 0 && (
                      <div>
                        <p className="font-medium">Details:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {uploadResult.details.map((detail, index) => (
                            <li key={index}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {uploadResult.validationErrors && uploadResult.validationErrors.length > 0 && (
                      <div>
                        <p className="font-medium">Validation Errors:</p>
                        <div className="max-h-40 overflow-y-auto">
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {uploadResult.validationErrors.slice(0, 10).map((error, index) => (
                              <li key={index}>
                                Row {error.row}, {error.field}: {error.error}
                                {error.value && ` (value: "${error.value}")`}
                              </li>
                            ))}
                            {uploadResult.validationErrors.length > 10 && (
                              <li className="text-gray-600">
                                ... and {uploadResult.validationErrors.length - 10} more errors
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}
                    {uploadResult.userRole && uploadResult.maxSuppliers && uploadResult.attemptedRecords && (
                      <div className="mt-2 p-2 bg-yellow-100 rounded">
                        <p className="text-sm">
                          <strong>Upgrade Required:</strong> Your {uploadResult.userRole} plan allows up to{' '}
                          {uploadResult.maxSuppliers} suppliers, but your CSV contains{' '}
                          {uploadResult.attemptedRecords} records.
                        </p>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Important Notes */}
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Important:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>This will replace ALL your existing supplier data</li>
            <li>Your previous data will be saved for audit purposes</li>
            <li>Criticality scores will be recalculated automatically</li>
            <li>Use the template for correct formatting</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}