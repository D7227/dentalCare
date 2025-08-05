//  TODO: set the daynamic Data and mange the type
import React, { useState } from 'react';
import StatsModal from './StatsModal';
import FigmaStatCard from '@/components/ui/FigmaStatCard';
import { bigCard1, bigCard2, bigCard3, card1, card2, card3, icon_1, icon_2, icon_3, icon_4, icon_5, icon_6 } from '@/assets/svg';

const StatsCards = () => {
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats: any = [
    {
      title: 'Draft',
      value: 0,
      data: 0,
      key: 'active',
      iconSrc: icon_1,
      backgroundSrc: card1,
      bigBackgroundSrc: bigCard1,
    },
    {
      title: 'Pending approval case',
      value: 0,
      data: 0,
      key: 'arriving',
      iconSrc: icon_2,
      backgroundSrc: card2,
      bigBackgroundSrc: bigCard2,
    },
    {
      title: 'Active cases',
      value: 0,
      data: 0,
      key: 'appointments',
      iconSrc: icon_3,
      backgroundSrc: card3,
      bigBackgroundSrc: bigCard3,
    },
    {
      title: 'Orders Arriving today',
      value: 0,
      data: 0,
      key: 'pickup',
      iconSrc: icon_4,
      backgroundSrc: card1,
      bigBackgroundSrc: bigCard1,
    },
    {
      title: 'Delivered',
      value: 0,
      data: 0,
      key: 'pickup',
      iconSrc: icon_5,
      backgroundSrc: card2,
      bigBackgroundSrc: bigCard2,
    },
    {
      title: 'Total Order',
      value: 0,
      data: 0,
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

  const getModalData = () => stats.find((s: any) => s.key === selectedStat)?.data || [];
  const getModalTitle = () => stats.find((s: any) => s.key === selectedStat)?.title || '';

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