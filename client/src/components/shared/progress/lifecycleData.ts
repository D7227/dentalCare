
import { CheckCircle, Clock, Package, Truck, FileCheck, Wrench, Send, MapPin } from 'lucide-react';
import { LifecycleStage } from './types';

export const getLifecycleStages = (orderStatus?: string): LifecycleStage[] => {
  const stages = [
    {
      id: 'submitted',
      title: 'Submitted',
      icon: FileCheck,
      role: 'Doctor',
      person: 'Dr. Sarah Mitchell',
      timestamp: '2024-12-01 10:30 AM'
    },
    {
      id: 'picked-up',
      title: 'Picked Up',
      icon: Truck,
      role: 'Field Agent',
      person: 'John Kumar',
      timestamp: '2024-12-01 2:15 PM'
    },
    {
      id: 'inwarded',
      title: 'Inwarded',
      icon: Package,
      role: 'Lab Assistant',
      person: 'Priya Sharma',
      timestamp: '2024-12-01 4:20 PM'
    },
    {
      id: 'qa-approved',
      title: 'QA Approved',
      icon: CheckCircle,
      role: 'QA Manager',
      person: 'Rajesh Gupta',
      timestamp: orderStatus !== 'Pending' ? '2024-12-02 9:00 AM' : undefined
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      icon: Wrench,
      role: 'Technician',
      person: 'Amit Patel',
      timestamp: orderStatus === 'In Progress' || orderStatus === 'Completed' ? '2024-12-02 11:30 AM' : undefined
    },
    {
      id: 'trial-sent',
      title: 'Trial Sent',
      icon: Send,
      role: 'Lab Manager',
      person: 'Sunita Roy',
      timestamp: undefined
    },
    {
      id: 'finalizing',
      title: 'Finalizing',
      icon: Wrench,
      role: 'Senior Technician',
      person: 'Vikram Singh',
      timestamp: undefined
    },
    {
      id: 'dispatched',
      title: 'Dispatched',
      icon: Truck,
      role: 'Logistics',
      person: 'Delivery Team',
      timestamp: undefined
    },
    {
      id: 'delivered',
      title: 'Delivered',
      icon: MapPin,
      role: 'Field Agent',
      person: 'John Kumar',
      timestamp: orderStatus === 'Completed' ? '2024-12-05 3:45 PM' : undefined
    }
  ];

  return stages.map((stage, index) => {
    let status: 'completed' | 'current' | 'pending' = 'pending';
    
    if (orderStatus === 'Pending') {
      if (index < 3) status = 'completed';
      else if (index === 3) status = 'current';
    } else if (orderStatus === 'In Progress') {
      if (index < 4) status = 'completed';
      else if (index === 4) status = 'current';
    } else if (orderStatus === 'Completed') {
      if (index < 8) status = 'completed';
      else if (index === 8) status = 'current';
    } else if (orderStatus === 'Rejected') {
      if (index < 4) status = 'completed';
      else if (index === 3) status = 'current';
    }

    return {
      ...stage,
      status
    };
  });
};
