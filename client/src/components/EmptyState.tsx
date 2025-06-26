
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const EmptyState = ({ icon, title, description }: EmptyStateProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">{title}</h1>
      </div>
      
      <Card className="card">
        <CardContent className="p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              {icon}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Coming Soon
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyState;
