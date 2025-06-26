
import React from 'react';
import { cn } from '@/lib/utils';
import { ProgressIndicatorProps } from './progress/types';
import { getLifecycleStages } from './progress/lifecycleData';
import DesktopProgressView from './progress/DesktopProgressView';
import TabletProgressView from './progress/TabletProgressView';
import MobileProgressView from './progress/MobileProgressView';
import LegacyProgressView from './progress/LegacyProgressView';

const ProgressIndicator = ({ steps, orderStatus, className }: ProgressIndicatorProps) => {
  // If steps are provided (legacy), use the old format
  if (steps) {
    return <LegacyProgressView steps={steps} className={className} />;
  }

  const lifecycleStages = getLifecycleStages(orderStatus);
  const completedStages = lifecycleStages.filter(s => s.status === 'completed').length;
  const progressPercentage = (completedStages / (lifecycleStages.length - 1)) * 100;

  return (
    <div className={cn('w-full', className)}>
      <DesktopProgressView stages={lifecycleStages} progressPercentage={progressPercentage} />
      <TabletProgressView stages={lifecycleStages} progressPercentage={progressPercentage} />
      <MobileProgressView stages={lifecycleStages} progressPercentage={progressPercentage} />
    </div>
  );
};

export default ProgressIndicator;
