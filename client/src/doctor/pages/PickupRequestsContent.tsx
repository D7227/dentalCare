
import React, { useState } from 'react';
import { Plus, Clock, CheckCircle, AlertCircle, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PickupRequestModal from '../components/pickup/PickupRequestModal';
import ReschedulePickupModal from '../components/pickup/ReschedulePickupModal';
import CancelPickupModal from '../components/pickup/CancelPickupModal';

interface PickupRequest {
  id: string;
  orders: string[];
  date: string;
  timeSlot: string;
  contactPerson: string;
  status: 'pending' | 'accepted' | 'completed';
  requestedDate: string;
  notes?: string;
}

const PickupRequestsContent = () => {
  const [pickupRequests] = useState<PickupRequest[]>([
    {
      id: 'PR001',
      orders: ['DL-2024-001', 'DL-2024-002'],
      date: '2024-01-15',
      timeSlot: '10:00 AM - 12:00 PM',
      contactPerson: 'John Smith',
      status: 'accepted',
      requestedDate: '6/3/2025',
      notes: 'Crown work ready for pickup'
    },
    {
      id: 'PR002',
      orders: ['DL-2024-003'],
      date: '2024-01-16',
      timeSlot: '2:00 PM - 4:00 PM',
      contactPerson: 'Sarah Johnson',
      status: 'pending',
      requestedDate: '6/4/2025',
      notes: 'Bridge work completed'
    }
  ]);

  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const handleReschedule = (requestId: string) => {
    setSelectedRequestId(requestId);
    setIsRescheduleModalOpen(true);
  };

  const handleCancel = (requestId: string) => {
    setSelectedRequestId(requestId);
    setIsCancelModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            {/* <h1 className="text-3xl font-bold text-foreground">Pickup Requests</h1>
            <p className="text-muted-foreground">Manage pickup requests for completed orders</p> */}
          </div>
          <Button 
            className="btn-primary"
            onClick={() => setIsPickupModalOpen(true)}
          >
            <Plus className="mr-2" size={16} />
            Request Pickup
          </Button>
        </div>

        {/* Content */}
        <Card className="card clinical-shadow">
          <CardHeader className="card-header">
            <CardTitle className="card-title">Pickup Request Today</CardTitle>
          </CardHeader>
          <CardContent className="card-content space-y-4">
            {pickupRequests.map((request) => (
              <div
                key={request.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{request.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      Orders: {request.orders.join(', ')}
                    </p>
                  </div>
                  <Badge className={`border ${getStatusColor(request.status)} flex items-center gap-1`}>
                    {getStatusIcon(request.status)}
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{request.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">{request.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Contact:</span>
                    <span className="font-medium">{request.contactPerson}</span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground mb-3">
                  <span className="font-medium">Requested:</span> {request.requestedDate}
                </div>

                {request.notes && (
                  <div className="text-sm">
                    <span className="text-muted-foreground font-medium">Notes:</span>{' '}
                    <span className="text-foreground">{request.notes}</span>
                  </div>
                )}

                {request.status === 'pending' && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="btn-outline text-xs h-7 px-2"
                      onClick={() => handleReschedule(request.id)}
                    >
                      Reschedule
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="btn-destructive text-xs h-7 px-2"
                      onClick={() => handleCancel(request.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {pickupRequests.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="empty-state-title">No pickup requests</h3>
                <p className="empty-state-description">
                  You haven't made any pickup requests yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Modals */}
      <PickupRequestModal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
      />
      <ReschedulePickupModal
        isOpen={isRescheduleModalOpen}
        onClose={() => {
          setIsRescheduleModalOpen(false);
          setSelectedRequestId(null);
        }}
        pickupRequestId={selectedRequestId}
      />
      <CancelPickupModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setSelectedRequestId(null);
        }}
        pickupRequestId={selectedRequestId}
      />
    </>
  );
};

export default PickupRequestsContent;
