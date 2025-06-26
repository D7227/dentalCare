import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Truck, AlertCircle, MapPin, Clock } from "lucide-react";

interface PickupTabProps {
  order: any;
  doctor: any;
}

const PickupTab: React.FC<PickupTabProps> = ({ order, doctor }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Impression Handling & Pickup Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Pickup Address</p>
            <p className="font-medium">{doctor?.location || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pickup Status</p>
            <Badge variant="default">Scheduled</Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pickup Date</p>
            <p className="font-medium">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Agent</p>
            <p className="font-medium">John Kumar</p>
          </div>
        </div>
        <Separator />
        <div>
          <h4 className="font-medium mb-2">Handling Instructions</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <span className="text-sm">Handle with extreme care - fragile impressions</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Temperature controlled transport required</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-500" />
              <span className="text-sm">Deliver within 24 hours of pickup</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PickupTab; 