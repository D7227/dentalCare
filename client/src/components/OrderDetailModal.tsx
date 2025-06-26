import React from 'react';
import { ArrowLeft, User, Phone, Mail, Activity, Check, FileText, Heart, Package, Clock, MapPin, Truck, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ isOpen, onClose, order }) => {
  // Fetch patient data if we have an order
  const { data: patient } = useQuery<any>({
    queryKey: [`/api/patients/${order?.patientId}`],
    enabled: !!order?.patientId,
  });

  // Fetch order details if we have an order ID
  const { data: orderDetails } = useQuery({
    queryKey: [`/api/orders/${order?.id}`],
    enabled: !!order?.id,
  });

  if (!isOpen) return null;

  // Use the fetched order details or fallback to the passed order
  const currentOrder = orderDetails || order;

  // Enhanced lifecycle stages with proper status mapping
  const getLifecycleStages = (orderStatus: string) => {
    const stages = [
      { id: 'submitted', title: 'Submitted', icon: <FileText className="w-4 h-4" />, person: 'Dr. Sarah M', role: 'Doctor' },
      { id: 'picked_up', title: 'Picked Up', icon: <Package className="w-4 h-4" />, person: 'John K', role: 'Field Agent' },
      { id: 'lab_received', title: 'Lab Received', icon: <Activity className="w-4 h-4" />, person: 'Priya S', role: 'Lab Assistant' },
      { id: 'qa_approved', title: 'QA Approved', icon: <Check className="w-4 h-4" />, person: 'Rajesh G', role: 'QA Manager' },
      { id: 'in_progress', title: 'In Progress', icon: <Clock className="w-4 h-4" />, person: 'Amit P', role: 'Technician' },
      { id: 'final_review', title: 'Final Review', icon: <Check className="w-4 h-4" />, person: 'Sunita Roy', role: 'Senior Technician' },
      { id: 'dispatched', title: 'Dispatched', icon: <Truck className="w-4 h-4" />, person: 'Delivery Team', role: 'Logistics' },
      { id: 'delivered', title: 'Delivered', icon: <Home className="w-4 h-4" />, person: 'John K', role: 'Field Agent' }
    ];

    // Map status to completion level - showing realistic progress
    const statusMap: { [key: string]: number } = {
      'new': 1,                    // First stage completed - Submitted
      'pending': 3,                // First 3 stages completed
      'picked_up': 2,              // First 2 stages completed
      'lab_received': 3,           // First 3 stages completed
      'inwarded': 3,               // First 3 stages completed
      'qa_approved': 4,            // First 4 stages completed
      'in_progress': 4,            // First 4 stages completed
      'trial_work_ready': 5,       // First 5 stages completed
      'trial_sent': 5,             // First 5 stages completed
      'finalizing': 6,             // First 6 stages completed
      'dispatched': 7,             // First 7 stages completed
      'completed': 8,              // All 8 stages completed
      'delivered': 8,              // All 8 stages completed
      'rejected': 4
    };

    const completedStages = statusMap[orderStatus?.toLowerCase()] || 3;

    // Define specific dates and times for each stage
    const stageDates = [
      { date: '2024-12-01', time: '10:30 AM' },
      { date: '2024-12-01', time: '2:15 PM' },
      { date: '2024-12-01', time: '4:20 PM' },
      { date: '2024-12-02', time: '9:00 AM' },
      { date: '2024-12-02', time: '11:30 AM' },
      { date: '2024-12-03', time: '2:45 PM' },
      { date: '2024-12-04', time: '10:15 AM' },
      { date: '2024-12-05', time: '3:45 PM' }
    ];

    return stages.map((stage, index) => ({
      ...stage,
      status: index < completedStages ? 'completed' : (index === completedStages ? 'current' : 'pending'),
      date: index < completedStages ? stageDates[index]?.date : undefined,
      time: index < completedStages ? stageDates[index]?.time : undefined
    }));
  };

  const stages = getLifecycleStages(currentOrder?.status || 'pending');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-900">Order {currentOrder?.id}</h1>
              <span className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                currentOrder?.status === 'completed' && "bg-green-100 text-green-800",
                currentOrder?.status === 'pending' && "bg-yellow-100 text-yellow-800",
                currentOrder?.status === 'in_progress' && "bg-blue-100 text-blue-800",
                currentOrder?.status === 'rejected' && "bg-red-100 text-red-800"
              )}>
                {currentOrder?.status || 'Pending'}
              </span>
            </div>
          </div>
          <div className="text-gray-600 font-medium">
            {currentOrder?.type || 'Crown'}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 px-6">
          <button className="px-4 py-3 text-teal-600 border-b-2 border-teal-600 font-medium">
            Order Details
          </button>
          <button className="px-4 py-3 text-gray-500 hover:text-gray-700">
            Chat(0
          </button>
          <button className="px-4 py-3 text-gray-500 hover:text-gray-700">
            Pickup
          </button>
          <button className="px-4 py-3 text-gray-500 hover:text-gray-700">
            Scan Booking
          </button>
          <button className="px-4 py-3 text-gray-500 hover:text-gray-700">
            Payment
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-full">
          {/* Patient Information */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Patient Information</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Patient Name</label>
                <p className="text-base font-semibold text-gray-900">
                  {patient ? `${patient.firstName} ${patient.lastName}` : 'Loading...'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Age</label>
                <p className="text-base text-gray-900">{patient?.age || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Gender</label>
                <p className="text-base text-gray-900">{patient?.gender || 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <label className="text-sm text-gray-500 block">Contact Number</label>
                  <p className="text-base text-gray-900">{patient?.contact || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <label className="text-sm text-gray-500 block">Email</label>
                  <p className="text-base text-gray-500">{patient?.email || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Lifecycle Progress */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-8">
              <Activity className="w-6 h-6 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Order Lifecycle Progress</h2>
            </div>

            {/* Progress Visualization */}
            <div className="relative mb-8">
              {/* Dashed progress line */}
              <div className="absolute top-5 left-12 right-12 h-px border-t-2 border-dashed" style={{ borderColor: '#07AD94' }}></div>
              
              {/* Stage circles */}
              <div className="flex justify-between items-center px-6">
                {stages.map((stage, index) => (
                  <div key={stage.id} className="flex flex-col items-center">
                    <div 
                      className="w-10 h-10 rounded-full border-2 flex items-center justify-center relative z-10"
                      style={{
                        backgroundColor: stage.status === 'completed' ? '#07AD94' : stage.status === 'current' ? 'white' : '#e5e7eb',
                        borderColor: stage.status === 'completed' ? '#07AD94' : stage.status === 'current' ? '#07AD94' : '#d1d5db'
                      }}>
                      {stage.status === 'completed' ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <div className={stage.status === 'current' ? "w-4 h-4" : "w-4 h-4 text-gray-400"}
                             style={stage.status === 'current' ? { color: '#07AD94' } : {}}>
                          {stage.icon}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage Details */}
            <div className="flex justify-between">
              {stages.map((stage, index) => (
                <div key={`${stage.id}-details`} className="flex flex-col items-center text-center min-w-[100px]">
                  <div className={`text-sm font-semibold mb-2 ${stage.status === 'completed' ? '' : 'text-gray-900'}`}
                       style={stage.status === 'completed' ? { color: '#07AD94' } : {}}>
                    {stage.title}
                  </div>
                  
                  {stage.date && (
                    <div className="text-xs text-gray-700 font-medium mb-1">
                      {stage.date}
                    </div>
                  )}
                  
                  {stage.time && (
                    <div className="text-xs text-gray-700 font-medium mb-2">
                      {stage.time}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-600">
                    {stage.person}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {stage.role}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Restoration & Treatment Details */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Restoration & Treatment Details</h2>
            </div>
            
            <div className="text-gray-500">
              Treatment details and tooth selection information will be displayed here.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;