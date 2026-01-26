import { useState } from 'react'
import { CheckCircle, XCircle, Clock, User, Mail, Phone } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { useJoinRequests } from '../hooks/useJoinRequests'
import { useUpdateJoinRequest } from '../hooks/useUpdateJoinRequest'
import type { JoinRequest } from '../types/join-request.types'

export function JoinRequestsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  
  const { data: pendingRequests, isLoading: pendingLoading } = useJoinRequests('pending', true)
  const { data: approvedRequests, isLoading: approvedLoading } = useJoinRequests('approved', activeTab === 'approved')
  const { data: rejectedRequests, isLoading: rejectedLoading } = useJoinRequests('rejected', activeTab === 'rejected')
  
  const { mutate: updateRequest, isPending: isUpdating } = useUpdateJoinRequest()

  const handleApprove = (requestId: string) => {
    updateRequest({ requestId, data: { status: 'approved' } })
  }

  const handleReject = (requestId: string) => {
    updateRequest({ requestId, data: { status: 'rejected' } })
  }

  const renderRequestCard = (request: JoinRequest, showActions: boolean = false) => (
    <Card key={request.request_id} className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{request.user?.name || 'Unknown User'}</h3>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <Mail className="h-4 w-4 mr-1" />
                {request.user?.email || 'N/A'}
              </div>
              {request.user?.contact && (
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Phone className="h-4 w-4 mr-1" />
                  {request.user.contact}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Requested: {new Date(request.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
          
          {showActions && (
            <div className="flex space-x-2 ml-4">
              <Button
                onClick={() => handleApprove(request.request_id)}
                disabled={isUpdating}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                onClick={() => handleReject(request.request_id)}
                disabled={isUpdating}
                variant="destructive"
                size="sm"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Join Requests</h1>
        <p className="text-gray-600 mt-2">
          Review and manage requests from users who want to join your clinic
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Pending ({pendingRequests?.length || 0})</span>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Approved ({approvedRequests?.length || 0})</span>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center space-x-2">
            <XCircle className="h-4 w-4" />
            <span>Rejected ({rejectedRequests?.length || 0})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingLoading ? (
            <div className="text-center py-8 text-gray-500">Loading pending requests...</div>
          ) : pendingRequests && pendingRequests.length > 0 ? (
            <div>
              {pendingRequests.map((request) => renderRequestCard(request, true))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Pending Requests</CardTitle>
                <CardDescription>
                  There are no pending join requests at the moment.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          {approvedLoading ? (
            <div className="text-center py-8 text-gray-500">Loading approved requests...</div>
          ) : approvedRequests && approvedRequests.length > 0 ? (
            <div>
              {approvedRequests.map((request) => renderRequestCard(request))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Approved Requests</CardTitle>
                <CardDescription>
                  You haven't approved any join requests yet.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          {rejectedLoading ? (
            <div className="text-center py-8 text-gray-500">Loading rejected requests...</div>
          ) : rejectedRequests && rejectedRequests.length > 0 ? (
            <div>
              {rejectedRequests.map((request) => renderRequestCard(request))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Rejected Requests</CardTitle>
                <CardDescription>
                  You haven't rejected any join requests yet.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
