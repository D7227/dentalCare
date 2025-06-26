
import { LucideIcon } from 'lucide-react';

export interface LifecycleStage {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'pending';
  icon: LucideIcon;
  timestamp?: string;
  role: string;
  person: string;
}

export interface ProgressIndicatorProps {
  steps?: any[];
  orderStatus?: string;
  className?: string;
}

export interface ProgressViewProps {
  stages: LifecycleStage[];
  progressPercentage: number;
}
