import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreditCard, DollarSign } from "lucide-react";

interface PaymentTabProps {
  order: any;
  onPayment: (type: "online" | "collection") => void;
}

const PaymentTab: React.FC<PaymentTabProps> = ({ order, onPayment }) => {
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
          <CreditCard className="h-5 w-5" />
          Payment Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-6">
          {/* Online Payment */}
          <Card className="border-2 border-dashed">
            <CardHeader className="text-center">
              <CreditCard className="h-8 w-8 mx-auto mb-2" style={{ color: "#00A3C8" }} />
              <CardTitle className="text-lg">Pay Online</CardTitle>
              <CardDescription>Secure online payment via UPI, Card, or Net Banking</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="w-full" style={{ backgroundColor: "#00A3C8" }} onClick={() => onPayment("online")}>Pay ₹{order.outstandingAmount || "10,000"}</Button>
            </CardContent>
          </Card>
          {/* Cash/Cheque Collection */}
          <Card className="border-2 border-dashed">
            <CardHeader className="text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <CardTitle className="text-lg">Cash/Cheque Collection</CardTitle>
              <CardDescription>Request agent to collect payment at delivery</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" className="w-full" onClick={() => onPayment("collection")}>Request Collection</Button>
            </CardContent>
          </Card>
        </div>
        <Separator />
        {/* Payment History */}
        <div>
          <h4 className="font-medium mb-3">Payment History</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium">Initial Payment</p>
                <p className="text-sm text-muted-foreground">Paid via UPI</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">₹{order.paidAmount || 0}</p>
                <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentTab; 