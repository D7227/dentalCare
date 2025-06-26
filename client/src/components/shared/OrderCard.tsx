
import React from 'react';
import { Calendar, Clock, MessageSquare, CreditCard, CheckCircle2, XCircle, RefreshCw, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrderData, PatientData, getPriorityBadge, getPaymentStatusVariant, formatDate } from '../../types';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderCardProps {
  order: OrderData;
  patient: PatientData;
  toothNumbers?: number[];
  compact?: boolean;
  showActions?: boolean;
  className?: string;
  onView?: () => void;
  onResubmit?: () => void;
  onPayNow?: () => void;
}

const OrderCard = ({
  order,
  patient,
  toothNumbers,
  compact = false,
  showActions = true,
  className,
  onView,
  onResubmit,
  onPayNow
}: OrderCardProps) => {
  const patientName = `${patient.firstName} ${patient.lastName}`.trim();

  return (
    <Card className={`hover:shadow-md transition-shadow flex flex-col bg-[#FBFBFB] border-border ${className || ''}`}>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-card-foreground text-sm">{order.orderId}</h3>
              <p className="text-[16px] text-[#020817]">{patientName}</p>
            </div>
            <div className="flex items-center gap-2">
              {order.urgency && order.urgency !== 'standard' && (
                <Badge variant={getPriorityBadge(order.dueDate, order.priority).variant} className="text-xs">
                  {order.urgency.charAt(0).toUpperCase() + order.urgency.slice(1)}
                </Badge>
              )}
              <Badge variant={getStatusBadge(order.status).variant} className="text-xs">
                {getStatusBadge(order.status).label}
              </Badge>
            </div>
          </div>

          {/* Type and Date */}
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-[#047869] text-[14px]">{order.type}</span>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar size={14} />
              <span>{formatDate(order.createdAt)}</span>
              {order.time && (
                <>
                  <Clock size={14} className="ml-2" />
                  <span>{order.time}</span>
                </>
              )}
            </div>
          </div>

          {/* Tooth Numbers and Materials */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Teeth:</span>
              <div className="flex flex-wrap gap-1">
                {toothNumbers && toothNumbers.length > 0 ? (
                  toothNumbers.map((tooth, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                      {tooth}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline" className="text-xs px-2 py-0">
                    N/A
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs font-medium text-muted-foreground">Material:</span>
              <div className="flex-1">
                <p className="text-xs text-card-foreground">
                  {order.materials && order.materials.length > 0 ? order.materials.join(', ') : 'Standard'}
                </p>
              </div>
            </div>
          </div>

          {/* Trial Status */}
          {order.trialStatus && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {order.trialStatus}
              </Badge>
            </div>
          )}

          {/* Rejection Info */}
          {order.status === "Rejected" && order.rejectionReason && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-start gap-2">
                <XCircle size={16} className="text-destructive mt-0.5 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-destructive">Rejected</p>
                  <p className="text-xs text-destructive/80">{order.rejectionReason}</p>
                  {order.rejectedBy && order.rejectedDate && (
                    <p className="text-xs text-destructive/70">
                      By {order.rejectedBy} on {order.rejectedDate}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Status Indicators */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Messages */}
              {order.unreadMessages && order.unreadMessages > 0 && (
                <div className="flex items-center gap-1 text-primary">
                  <MessageSquare size={14} />
                  <span className="text-xs font-medium">{order.unreadMessages}</span>
                </div>
              )}

              {/* Payment Status */}
              {order.paymentStatus && (
                <Badge variant={getPaymentStatusVariant(order.paymentStatus)} className="text-xs">
                  <CreditCard size={12} className="mr-1" />
                  {order.paymentStatus === 'paid' ? 'Paid' : 
                   order.paymentStatus === 'overdue' ? 'Overdue' : 'Pending'}
                </Badge>
              )}

              {/* Feedback Status */}
              {order.feedbackSubmitted && (
                <Badge variant="success" className="text-xs">
                  <CheckCircle2 size={12} className="mr-1" />
                  Feedback Submitted
                </Badge>
              )}

              {/* Clinic Items Status */}
              {order.clinicItemsStatus && (
                <Badge variant="outline" className="text-xs">
                  {order.clinicItemsStatus}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Actions - Always at bottom */}
        {showActions && (
          <div className="flex gap-2 pt-3 mt-auto">
            {onView && (
              <Button size="sm" variant="outline" onClick={onView} className="flex-1">
                <Eye size={14} className="mr-1" />
                View
              </Button>
            )}
            {order.status === "Rejected" && onResubmit && (
              <Button size="sm" onClick={onResubmit} className="flex-1">
                <RefreshCw size={14} className="mr-1" />
                Resubmit
              </Button>
            )}
            {(order.paymentStatus === 'pending' || order.paymentStatus === 'overdue') && onPayNow && (
              <Button size="sm" onClick={onPayNow} className="flex-1 btn-pay-now">
                <CreditCard size={14} className="mr-1" />
                Pay Now
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderCard;
