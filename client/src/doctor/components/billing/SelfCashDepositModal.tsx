import React, { useState } from 'react';
import BaseModal from '@/components/shared/BaseModal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Upload } from 'lucide-react';

interface SelfCashDepositModalProps {
    isOpen: boolean;
    onClose: () => void;
    billId: string;
    amount: number;
}

const SelfCashDepositModal = ({ isOpen, onClose, billId, amount }: SelfCashDepositModalProps) => {
    const [depositAmount, setDepositAmount] = useState(amount.toString());
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const { toast } = useToast();

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setUploadedFiles(prev => [...prev, ...files]);
    };

    const handleSubmit = () => {
        if (!depositAmount || !date) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields.",
                variant: "destructive"
            });
            return;
        }

        console.log('Self cash deposit request:', {
            billId,
            amount: depositAmount,
            date,
            notes,
            files: uploadedFiles
        });

        toast({
            title: "Deposit Request Submitted",
            description: `Self deposit of ₹${parseInt(depositAmount).toLocaleString()} has been recorded for ${date}.`,
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
                {/* Upload Photos Section */}
                <div className="space-y-3">
                    <Label className="text-base font-medium">Upload Photos</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Upload className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="text-sm text-gray-600">
                                Drop files here or{' '}
                                <label className="text-[#11AB93] cursor-pointer hover:underline">
                                    upload
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <div className="text-xs text-gray-500">
                                Supports: JPG, PNG, (Max 10MB)
                            </div>
                        </div>
                    </div>
                    {uploadedFiles.length > 0 && (
                        <div className="text-sm text-gray-600">
                            {uploadedFiles.length} file(s) uploaded
                        </div>
                    )}
                </div>

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
                    <Label htmlFor="deposit-amount">Amount</Label>
                    <Input
                        id="deposit-amount"
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="Enter amount"
                    />
                </div>

                {/* Date */}
                <div className="space-y-2">
                    <Label htmlFor="deposit-date">Date <span className="text-red-500">*</span></Label>
                    <Input
                        id="deposit-date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="mm/dd/yyyy"
                    />
                </div>

                {/* Special Instructions */}
                <div className="space-y-2">
                    <Label htmlFor="deposit-notes">Special Instructions (Optional)</Label>
                    <Textarea
                        id="deposit-notes"
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

export default SelfCashDepositModal;