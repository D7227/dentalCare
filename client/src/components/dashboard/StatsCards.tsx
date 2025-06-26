
import React, { useState } from 'react';
import StatsModal from './modals/StatsModal';
import { ordersData } from '@/data/ordersData';
import FigmaStatCard from '@/components/ui/FigmaStatCard';
import { bigCard1, bigCard2, bigCard3, card1, card2, card3, icon_1, icon_2, icon_3, icon_4, icon_5, icon_6 } from '@/assets/svg';
// import { CustomCard } from '../common/CustomCard';

const StatsCards = () => {
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeCases = ordersData.filter(order =>
    ['In Progress', 'New', 'Trial Work Ready'].includes(order.status)
  );
  
  const arrivingToday = ordersData.filter(order => 
    order.status === 'Trial Work Ready' || order.status === 'Completed'
  );

  const scanAppointments = [
    {
      id: 'SCAN-001',
      patient: 'John Smith',
      type: 'Full Arch Scan',
      status: 'New',
      date: '2024-01-20',
      dueDate: '2024-01-20',
      urgency: 'standard' as const,
      time: '10:00 AM'
    }
  ];
  
  const pickupRequests = ordersData.filter(order => 
    order.status === 'Trial Work Ready'
  );

  const stats:any = [
    {
      title: 'Draft',
      value: activeCases.length,
      data: activeCases,
      key: 'active',
      iconSrc: icon_1,
      backgroundSrc: card1,
      bigBackgroundSrc: bigCard1,
    },
    {
      title: 'Pending approval case',
      value: arrivingToday.length,
      data: arrivingToday,
      key: 'arriving',
      iconSrc: icon_2,
      backgroundSrc: card2,
      bigBackgroundSrc: bigCard2,
    },
    {
      title: 'Active cases',
      value: scanAppointments.length,
      data: scanAppointments,
      key: 'appointments',
      iconSrc: icon_3,
      backgroundSrc: card3,
      bigBackgroundSrc: bigCard3,
    },
    {
      title: 'Orders Arriving today',
      value: pickupRequests.length,
      data: pickupRequests,
      key: 'pickup',
      iconSrc: icon_4,
      backgroundSrc: card1,
      bigBackgroundSrc: bigCard1,
    },
    {
      title: 'Delivered',
      value: pickupRequests.length,
      data: pickupRequests,
      key: 'pickup',
      iconSrc: icon_5,
      backgroundSrc: card2,
      bigBackgroundSrc: bigCard2,
    },
    {
      title: 'Total Order',
      value: pickupRequests.length,
      data: pickupRequests,
      key: 'pickup',
      iconSrc: icon_6,
      backgroundSrc: card3,
      bigBackgroundSrc: bigCard3,
    },
  ];

  const handleStatClick = (stat: any) => {
    setSelectedStat(stat.key);
    setIsModalOpen(true);
  };

  const getModalData = () => stats.find(s => s.key === selectedStat)?.data || [];
  const getModalTitle = () => stats.find(s => s.key === selectedStat)?.title || '';

  return (
    <>
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"> */}
      <div className="flex gap-3 flex-wrap">
        {stats.map((stat, index) => (
          <FigmaStatCard
            key={index}
            title={stat?.title}
            value={stat?.value}
            iconSrc={stat?.iconSrc}
            backgroundSrc={stat?.backgroundSrc}
            bigBackgroundSrc={stat?.bigBackgroundSrc}
            subtext={stat?.subtext}
            onClick={() => handleStatClick(stat)}
          />
        ))}
      </div>

      <StatsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={getModalTitle()}
        orders={getModalData()}
      />
    </>
  );
};

export default StatsCards;