import React, { useState } from 'react';
import BaseModal from '@/components/shared/BaseModal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

interface PartPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    billId: string;
    amount: number;
}

const PartPaymentModal = ({ isOpen, onClose, billId, amount }: PartPaymentModalProps) => {
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'online'>('online');
    const [notes, setNotes] = useState('');
    const { toast } = useToast();

    const handleSubmit = () => {
        if (!paymentAmount) {
            toast({
                title: "Missing Information",
                description: "Please enter the payment amount.",
                variant: "destructive"
            });
            return;
        }

        console.log('Part payment request:', {
            billId,
            amount: paymentAmount,
            paymentMethod,
            notes
        });

        toast({
            title: "Payment Request Submitted",
            description: `Part payment of ₹${parseInt(paymentAmount).toLocaleString()} will be processed via ${paymentMethod} payment.`,
        });

        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Request Cash/Cheque Collection"
            className="max-w-md z-[200]"
        >
            <div className="space-y-4">
                {/* Amount Display */}
                <Card className="bg-gray-50 border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-[#11AB93]/10">
                                <DollarSign className="h-5 w-5 text-[#11AB93]" />
                            </div>
                            <div>
                                <p className="text-lg font-semibold">Collection Amount:</p>
                                <p className="text-sm text-gray-600">Bill ID: {billId}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Amount Input */}
                <div className="space-y-2">
                    <Label htmlFor="payment-amount">Amount</Label>
                    <Input
                        id="payment-amount"
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="Enter amount"
                    />
                </div>

                {/* Payment Method */}
                <div className="space-y-3">
                    <RadioGroup
                        value={paymentMethod}
                        onValueChange={(value: 'online') => setPaymentMethod(value)}
                        className="space-y-2"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="online" id="online" />
                            <Label htmlFor="online" className="text-sm cursor-pointer">
                                Online (UPI, Credit card, Online banking)
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Special Instructions */}
                <div className="space-y-2">
                    <Label htmlFor="payment-notes">Special Instructions (Optional)</Label>
                    <Textarea
                        id="payment-notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any special scan requirements..."
                        rows={3}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="flex-1 bg-[#11AB93] hover:bg-[#0f9b84]"
                    >
                        Submit Request
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
};

export default PartPaymentModal;
