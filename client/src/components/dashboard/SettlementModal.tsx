import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface SettlementModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettlementModal: React.FC<SettlementModalProps> = ({ isOpen, onClose }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const paymentOptions = [
        {
            id: "cheque",
            title: "Cheque collection",
            icon: "📋",
            color: "bg-green-50 border-green-200",
        },
        {
            id: "cash",
            title: "Cash collection",
            icon: "💰",
            color: "bg-blue-50 border-blue-200",
        },
        {
            id: "self-cash",
            title: "Self Cash deposit",
            icon: "💵",
            color: "bg-green-50 border-green-200",
        },
        {
            id: "part-payment",
            title: "Part payment",
            icon: "💳",
            color: "bg-blue-50 border-blue-200",
        },
    ];

    const historyItems = [
        {
            id: 1,
            type: "CASH",
            amount: "₹38,000",
            description: "Pending collection",
            date: "6-18-2025",
            color: "bg-green-100 text-green-800",
        },
        {
            id: 2,
            type: "CHEQUE",
            amount: "₹23,000",
            description: "Collected by Rahul waiting for diposit",
            date: "6-20-2025",
            color: "bg-orange-100 text-orange-800",
        },
        {
            id: 3,
            type: "UPI",
            reference: "SBI-2345",
            amount: "₹1,235",
            description: "To be confirmed accounts department",
            date: "6-18-2025",
            color: "bg-purple-100 text-purple-800",
        },
        {
            id: 4,
            type: "CASH",
            amount: "₹38,000",
            description: "Collected by Rahul",
            date: "6-18-2025",
            color: "bg-green-100 text-green-800",
        },
        {
            id: 5,
            type: "UPI",
            reference: "SBI-2345",
            amount: "₹1,235",
            description: "Waiting for payment by you",
            date: "6-18-2025",
            color: "bg-purple-100 text-purple-800",
        },
        {
            id: 6,
            type: "CHEQUE",
            reference: "HDFC-9812",
            amount: "₹23,000",
            description: "Collected by Rahul waiting for diposit",
            date: "6-20-2025",
            color: "bg-orange-100 text-orange-800",
        },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
                <DialogHeader className="relative">
                    <div className="flex items-center gap-3 mb-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 h-8 w-8"
                            onClick={onClose}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <DialogTitle className="text-lg font-semibold">
                            Settlement
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Payment Options */}
                    <div className="grid grid-cols-2 gap-3">
                        {paymentOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => setSelectedOption(option.id)}
                                className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${selectedOption === option.id
                                        ? "border-blue-500 bg-blue-50"
                                        : option.color
                                    }`}
                            >
                                <div className="text-2xl mb-2">{option.icon}</div>
                                <div className="text-sm font-medium text-gray-700">
                                    {option.title}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* History Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">History</h3>
                        <div className="space-y-3">
                            {historyItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full font-medium ${item.color}`}
                                            >
                                                {item.type}
                                            </span>
                                            {item.reference && (
                                                <span className="text-xs text-gray-600">
                                                    {item.reference}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600 mb-1">
                                            {item.description}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-semibold text-gray-900">
                                            {item.amount}
                                        </div>
                                        <div className="text-xs text-gray-500">{item.date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes Section */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-sm mb-2">Notes:</h4>
                        <p className="text-sm text-gray-600">
                            This payment will be confirm by account department and will be
                            added to your ledger balance after confirmation
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SettlementModal;