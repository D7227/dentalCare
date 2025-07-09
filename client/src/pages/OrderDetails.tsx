import React, { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { 
  User, FileText, Clock, AlertTriangle, Download, Printer, 
  MessageCircle, CreditCard, Package, MapPin, Calendar,
  Heart, Palette, Activity, Phone, Mail, UserCheck,
  Stethoscope, Wrench, Truck, QrCode, RefreshCw, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/shared/StatusBadge';
import ProgressIndicator from '@/components/shared/ProgressIndicator';
import ChatModule from '@/components/chat/ChatModule';
import PickupRequestsContent from '@/components/pickup/PickupRequestsContent';
import ScanBookingContent from '@/components/ScanBookingContent';
import { useToast } from '@/hooks/use-toast';
import { getStatusColor } from '@/utils/orderUtils';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '@/store/hooks';

const OrderDetails = () => {
  const [location, setLocation] = useLocation();
  const { orderId } = useParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'details' | 'chat' | 'pickup' | 'scan' | 'payment'>('details');
  const { user } = useAppSelector(state => state.auth);
  const handlePaymentClick = (type: 'online' | 'collection') => {
    if (type === 'online') {
      toast({
        title: "Payment Gateway",
        description: "Redirecting to ICICI secure payment gateway...",
      });
      setTimeout(() => {
        toast({
          title: "Payment Successful",
          description: `Payment processed successfully.`,
        });
      }, 2000);
    } else {
      toast({
        title: "Collection Request Sent",
        description: "Agent will collect payment during delivery.",
      });
    }
  };

  // Fetch order by ID from API
  const { data: order, isLoading, error } = useQuery<any>({
    queryKey: [`/api/orders/${user?.clinicId}`, orderId],
    enabled: !!orderId,
  });

  // Fetch patient details
  const { data: patient } = useQuery<any>({
    queryKey: ['/api/patients/', order?.patientId],
    enabled: !!order?.patientId,
  });

  // Fetch tooth groups for the order
  const { data: toothGroups = [] } = useQuery<any[]>({
    queryKey: ['/api/orders/', orderId, '/tooth-groups'],
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#11AB93] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => window.history.back()} className="bg-[#11AB93] hover:bg-[#0F9A82]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Transform database order to match expected interface
  const transformedOrder = {
    ...order,
    patient: patient ? `${patient.firstName} ${patient.lastName}` : `Patient ${order.patientId}`,
    date: new Date(order.createdAt).toLocaleDateString(),
    dueDate: order.dueDate ? new Date(order.dueDate).toLocaleDateString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    time: new Date(order.createdAt).toLocaleTimeString(),
    // Add missing fields with defaults if needed
    tags: order.tags || [],
    unreadMessages: order.unreadMessages || 0,
    clinicItemsStatus: order.clinicItemsStatus || 'lab_provided',
    feedbackSubmitted: order.feedbackSubmitted || false,
    files: order.files || [],
    age: patient?.age || '',
    gender: patient?.sex || '',
    contact: patient?.contact || '',
  };

  const hasOutstandingPayment = transformedOrder.paymentStatus === 'pending' || transformedOrder.paymentStatus === 'overdue';
  const isRejected = transformedOrder.status === 'Rejected';

  const handlePrintOrder = () => {
    toast({
      title: "Preparing to print",
      description: "Order details are being formatted for printing...",
    });
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleDownloadFile = (fileName: string) => {
    toast({
      title: "Download started",
      description: `Downloading ${fileName}...`,
    });
  };

  const handlePayNow = () => {
    setActiveTab('payment');
    toast({
      title: "Opening payment gateway",
      description: "Redirecting to payment options...",
    });
  };

  const handleRequestPickup = () => {
    setActiveTab('pickup');
    toast({
      title: "Opening pickup request",
      description: "Loading pickup request form...",
    });
  };

  const handleBookScan = () => {
    setActiveTab('scan');
    toast({
      title: "Opening scan booking",
      description: "Loading scan appointment booking...",
    });
  };

  const handleChat = () => {
    setActiveTab('chat');
    toast({
      title: "Opening chat",
      description: "Loading order conversation...",
    });
  };

  const handleResubmit = () => {
    setLocation(`/resubmit-order/${orderId}`);
  };

  const tabs = [
    { id: 'details' as const, label: 'Order Details', icon: FileText },
    { id: 'chat' as const, label: 'Chat', icon: MessageCircle, badge: transformedOrder.unreadMessages },
    { id: 'pickup' as const, label: 'Pickup', icon: Truck },
    { id: 'scan' as const, label: 'Scan Booking', icon: QrCode },
    ...(hasOutstandingPayment ? [{ id: 'payment' as const, label: 'Payment', icon: CreditCard }] : []),
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatModule chatId={transformedOrder.id} onClose={() => setActiveTab('details')} />;
      case 'pickup':
        return <PickupRequestsContent />;
      case 'scan':
        return <ScanBookingContent />;
      case 'payment':
        return (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Payment Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <div className="text-3xl font-bold text-[#11AB93]">₹{transformedOrder.outstandingAmount || '5,000'}</div>
                <p className="text-gray-600">Outstanding payment for Order {transformedOrder.id}</p>
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    size="lg"
                    onClick={() => handlePaymentClick('online')}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay with ICICI Gateway
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handlePaymentClick('collection')}
                  >
                    Request Cash/Cheque Collection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return renderOrderDetails();
    }
  };

  const renderOrderDetails = () => (
    <div className="space-y-6">
      {/* Patient Information */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <User className="h-5 w-5" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Patient Name</label>
              <p className="text-lg font-semibold text-gray-900">{transformedOrder.patient}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Age</label>
              <p className="text-sm text-gray-800">{transformedOrder.age || 'Not specified'}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <p className="text-sm text-gray-800">{transformedOrder.gender || 'Not specified'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Contact Number</label>
              <p className="text-sm text-gray-800 flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {transformedOrder.contact || 'Not provided'}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-sm text-gray-800 flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {patient?.email || 'Not provided'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Lifecycle Progress */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Activity className="h-5 w-5" />
            Order Lifecycle Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <ProgressIndicator orderStatus={transformedOrder.status} />
          </div>
        </CardContent>
      </Card>

      {/* Restoration & Treatment Details */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Heart className="h-5 w-5" />
            Restoration & Treatment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tooth Selection with Abutment */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              🦷 Selected Teeth & Abutment Information
            </label>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              {toothGroups && toothGroups.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {toothGroups.map((toothGroup: any, index: number) => (
                      <div key={index} className="bg-gray-50 border border-gray-300 rounded-lg p-3 min-w-[120px]">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-800 mb-1">
                            🦷 {Array.isArray(toothGroup.teeth) ? toothGroup.teeth.join(', ') : toothGroup.teeth}
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div>Type: {toothGroup.type || 'Individual'}</div>
                            <div>Material: {toothGroup.material || 'Not specified'}</div>
                            <div>Shade: {toothGroup.shade || 'Not specified'}</div>
                            {toothGroup.notes && (
                              <div className="text-xs text-gray-500 mt-1">
                                Notes: {toothGroup.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600">No teeth selected for this order</p>
                </div>
              )}
            </div>
          </div>

          {/* Materials */}
          {order.tags && order.tags.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Palette size={14} />
                Materials & Specifications
              </label>
              <div className="flex flex-wrap gap-2">
                {order.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800 border-gray-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {order.notes && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Special Instructions</label>
              <div className="bg-white p-4 rounded-md border-l-4 border-gray-500 border border-gray-200">
                <p className="text-sm text-gray-800">{order.notes}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment & Billing */}
      {(hasOutstandingPayment || order.billing) && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <CreditCard className="h-5 w-5" />
              Payment & Billing
              {hasOutstandingPayment && (
                <Badge variant="destructive" className="ml-2 bg-red-500">Payment Due</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1 bg-white p-4 rounded-lg border border-gray-200">
                <label className="text-sm font-medium text-gray-700">Total Amount</label>
                <p className="text-xl font-bold text-gray-900">₹{order.totalAmount || '15,000'}</p>
              </div>
              <div className="space-y-1 bg-white p-4 rounded-lg border border-gray-200">
                <label className="text-sm font-medium text-gray-700">Paid Amount</label>
                <p className="text-lg font-semibold text-green-600">₹{order.paidAmount || '10,000'}</p>
              </div>
              <div className="space-y-1 bg-white p-4 rounded-lg border border-gray-200">
                <label className="text-sm font-medium text-gray-700">Outstanding</label>
                <p className="text-xl font-bold text-red-600">₹{order.outstandingAmount || '5,000'}</p>
              </div>
            </div>
            
            {hasOutstandingPayment && (
              <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={handlePayNow} className="bg-green-600 hover:bg-green-700">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay Now - ICICI Gateway
                </Button>
                <Button variant="outline">
                  Request Cash/Cheque Collection
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Rejection Details (if applicable) */}
      {isRejected && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5 animate-pulse" />
              Rejection Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Rejection Reason</label>
              <p className="text-sm text-red-700 bg-red-100 p-3 rounded-md border-l-4 border-red-500">
                {order.rejectionReason}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Rejected By</label>
                <p className="text-sm">{order.rejectedBy}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Rejection Date</label>
                <p className="text-sm">{order.rejectedDate || order.date}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Files & Attachments */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <FileText className="h-5 w-5" />
            Files & Attachments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {order.files && order.files.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {order.files.map((file: string, index: number) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-white rounded-md border border-gray-200 hover:border-gray-300 transition-colors">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm flex-1">{file}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    onClick={() => handleDownloadFile(file)}
                    title={`Download ${file}`}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No files attached to this order.</p>
            </div>
          )}
          
          {order.doctorNotes && (
            <div className="mt-4 space-y-1">
              <label className="text-sm font-medium text-gray-600">Additional Notes from Doctor</label>
              <div className="bg-white p-4 rounded-md border-l-4 border-blue-500 border border-gray-200">
                <p className="text-sm text-gray-800">{order.doctorNotes}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-semibold text-gray-900">
                  Order {order.id}
                </h1>
                <StatusBadge status={order.status} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{order.patient}</span>
              <Badge variant="outline">{order.type}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors",
                  activeTab === tab.id
                    ? "border-[#11AB93] text-[#11AB93]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <tab.icon size={16} />
                {tab.label}
                {tab.badge && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {tab.badge}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default OrderDetails;
