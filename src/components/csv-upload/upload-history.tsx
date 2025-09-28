"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  RefreshCw,
  AlertTriangle,
  TrendingUp
} from 'lucide-react'
import { UploadAuditLog } from '@/types/upload-audit'
import { format } from 'date-fns'

interface UploadHistoryProps {
  refreshTrigger?: number
}

export function UploadHistory({ refreshTrigger }: UploadHistoryProps) {
  const [uploadHistory, setUploadHistory] = useState<UploadAuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUploadHistory = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/suppliers/upload-history', {
        credentials: 'include'
      })

      if (!response.ok && response.status === 401) {
        window.location.href = '/api/auth/login'
        return
      }

      const data = await response.json()

      if (data.success) {
        setUploadHistory(data.uploadHistory || [])
      } else {
        setError(data.error || 'Failed to fetch upload history')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error fetching upload history:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUploadHistory()
  }, [refreshTrigger])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const formatDuration = (duration: number) => {
    if (duration < 1000) return `${duration}ms`
    return `${(duration / 1000).toFixed(2)}s`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Upload History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading upload history...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Upload History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchUploadHistory} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upload History
            </CardTitle>
            <CardDescription>
              Track your CSV upload activities and audit compliance
            </CardDescription>
          </div>
          <Button
            onClick={fetchUploadHistory}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {uploadHistory.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No upload history found</p>
            <p className="text-sm text-gray-500">Your CSV uploads will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {uploadHistory.map((upload) => (
              <div
                key={upload.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(upload.status)}
                    <div>
                      <h4 className="font-medium text-gray-900">{upload.filename}</h4>
                      <p className="text-sm text-gray-500">
                        {format(new Date(upload.uploadDate), 'MMM dd, yyyy at h:mm a')}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(upload.status)}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      {upload.recordsAttempted} records attempted
                    </span>
                  </div>

                  {upload.status === 'completed' && (
                    <>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-gray-600">
                          {upload.recordsSuccessful} successful
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-600">
                          {upload.previousRecordCount} → {upload.newRecordCount}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          {formatDuration(upload.uploadDuration)}
                        </span>
                      </div>
                    </>
                  )}

                  {upload.status === 'failed' && upload.recordsFailed > 0 && (
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-gray-600">
                        {upload.recordsFailed} failed
                      </span>
                    </div>
                  )}
                </div>

                {/* Error Details */}
                {upload.status === 'failed' && upload.errorDetails && upload.errorDetails.length > 0 && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium text-red-800 mb-2">Error Details:</p>
                    <ul className="text-sm text-red-700 space-y-1">
                      {upload.errorDetails.slice(0, 3).map((error, index) => (
                        <li key={index} className="list-disc list-inside">
                          {error}
                        </li>
                      ))}
                      {upload.errorDetails.length > 3 && (
                        <li className="text-red-600">
                          ... and {upload.errorDetails.length - 3} more errors
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Validation Errors */}
                {upload.validationErrors && upload.validationErrors.length > 0 && (
                  <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800 mb-2">Validation Issues:</p>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {upload.validationErrors.slice(0, 3).map((error, index) => (
                        <li key={index} className="list-disc list-inside">
                          Row {error.row}, {error.field}: {error.error}
                        </li>
                      ))}
                      {upload.validationErrors.length > 3 && (
                        <li className="text-yellow-600">
                          ... and {upload.validationErrors.length - 3} more validation errors
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Success Details */}
                {upload.status === 'completed' && upload.criticialityScoresRecalculated && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      ✓ Criticality scores were automatically recalculated for all suppliers
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}