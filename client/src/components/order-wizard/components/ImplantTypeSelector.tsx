import React, { useState, useEffect } from 'react';
import BaseModal from '@/components/shared/BaseModal';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

export type ImplantSelection = {
    value: string;
    provider: string;
    quantity: number;
};

export type ImplantSelectionsState = {
    retentionType: ImplantSelection | null;
    abutmentType: ImplantSelection | null;
};

interface ImplantTypeSelectorProps {
    formData: any;
    setFormData: (data: any) => void;
    editingTeethNumbers: number[];
    implantSelections: ImplantSelectionsState;
    setImplantSelections: React.Dispatch<React.SetStateAction<ImplantSelectionsState>>;
    onProviderPopupOpen?: (open: boolean) => void;
}

const ImplantTypeSelector: React.FC<ImplantTypeSelectorProps> = ({
    formData,
    setFormData,
    editingTeethNumbers,
    implantSelections,
    setImplantSelections,
    onProviderPopupOpen,
}) => {
    const [showProviderPopup, setShowProviderPopup] = useState(false);
    const [selectedItemValue, setSelectedItemValue] = useState('');
    // Local state for modal selections
    const [localProviders, setLocalProviders] = useState<{ [key: string]: string }>({});
    const [localQuantity, setLocalQuantity] = useState(1);
    // For step-by-step abutment material selection
    const [localAbutmentMaterial, setLocalAbutmentMaterial] = useState<string | null>(null);
    // For screwmentable, track if cement question is reached
    const [showCementQuestion, setShowCementQuestion] = useState(false);
    const [editMode, setEditMode] = useState(false)

    useEffect(() => {
        if (onProviderPopupOpen) onProviderPopupOpen(showProviderPopup);
    }, [showProviderPopup, onProviderPopupOpen]);

    // Reset modal state when opened
    useEffect(() => {
        if (showProviderPopup) {
            setLocalProviders({});
            setLocalQuantity(1);
            setLocalAbutmentMaterial(null);
            setShowCementQuestion(false);
        }
    }, [showProviderPopup, selectedItemValue]);

    const handleRadioChange = (value: string) => {
        setSelectedItemValue(value);
        setShowProviderPopup(true);
    };

    // Helper to update product array for sub-questions
    const updateProductProvider = (productName: string, provider: string) => {
        setLocalProviders(prev => ({ ...prev, [productName]: provider }));
    };

    // Helper to set provider for a specific question
    const setProviderFor = (question: string, provider: string) => {
        setLocalProviders(prev => ({ ...prev, [question]: provider }));
        updateProductProvider(question, provider);
    };

    const handleSave = () => {
        setEditMode(false);
        if (!selectedItemValue) return;

        // Update implantSelections
        const selectedProvider =
            localProviders['Screw'] ||
            localProviders['Ti-base'] ||
            localProviders['Abutment'] ||
            localProviders['Premilled'] ||
            localProviders['Cement'];

        setImplantSelections(prev => ({
            ...prev,
            retentionType: {
                value: selectedItemValue,
                provider: selectedProvider,
                quantity: localQuantity,
            },
        }));

        // Prepare product array
        const product: { name: string, provider: string }[] = Object.entries(localProviders).map(
            ([name, provider]) => ({ name, provider })
        );

        // Update formData here ONLY
        setFormData((prev: any) => ({
            ...prev,
            abutmentDetails: {
                abutmentType: selectedItemValue,
                quantity: editingTeethNumbers.length,
                product: product
            }
        }));

        setShowProviderPopup(false);
    };


    // Cancel modal
    const handleCancel = () => {
        setShowProviderPopup(false);
    };

    // Helper to determine if Save should be enabled
    const isSaveEnabled = () => {
        if (selectedItemValue === 'screw-retained') {
            return !!localProviders['Screw'] && !!localProviders['Ti-base'];
        }
        if (selectedItemValue === 'cement-retained') {
            if (!localAbutmentMaterial) return false;
            if (localAbutmentMaterial === 'Titanium Custom Abutment') {
                return !!localProviders['Premilled'];
            }
            if (localAbutmentMaterial === 'Zirconia Custom Abutment') {
                return !!localProviders['Ti-base'];
            }
            return false;
        }
        if (selectedItemValue === 'screwmentable') {
            if (!localAbutmentMaterial) return false;
            if (localAbutmentMaterial === 'Titanium Custom Abutment') {
                return !!localProviders['Premilled'] && !!localProviders['Cement'];
            }
            if (localAbutmentMaterial === 'Zirconia Custom Abutment') {
                return !!localProviders['Ti-base'] && !!localProviders['Cement'];
            }
            return false;
        }
        return false;
    };

    return (
        <>
            {formData.abutmentDetails.abutmentType && formData.abutmentDetails.product?.length > 0 && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex justify-between items-center mb-2">
                        <h5 className="text-lg font-semibold text-gray-900">
                            Abutment Details
                        </h5>
                        <button
                            type="button"
                            className="ml-2 p-1 text-gray-400 hover:text-blue-600"
                            onClick={() => { setEditMode(true); }}
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-gray-800 text-sm">
                        <div>
                            <b>Type:</b> {formData.abutmentDetails.abutmentType.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                        </div>
                        <div>
                            <b>Quantity:</b> {formData.abutmentDetails.quantity}
                        </div>
                        <div className="mt-2">
                            <b>Providers:</b>
                            <ul className="list-disc ml-5">
                                {formData.abutmentDetails.product.map((p: any, idx: number) => (
                                    <li key={idx}>{p.name}: {p.provider}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {(editMode || !formData?.abutmentDetails?.abutmentType) &&
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                    <h5 className="text-lg font-semibold text-gray-900 mb-2">
                        Type of Abutment to be Used
                    </h5>
                    <div className="flex flex-row gap-4 items-center">
                        {['screw-retained', 'cement-retained', 'screwmentable'].map((val) => (
                            <label key={val} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-green-50 transition-colors mt-0 gap-3">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        name="retentionType"
                                        value={val}
                                        checked={formData.retentionType === val}
                                        onChange={() => handleRadioChange(val)}
                                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                                    />
                                    <span className="ml-3 text-gray-700">
                                        {val.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            }
            <BaseModal
                isOpen={showProviderPopup}
                onClose={handleCancel}
                title={`Choose Provider for Retention Type `}
            >
                <div className="flex flex-col gap-4">
                    {/* Example: Provider selection for screw-retained */}
                    {selectedItemValue === 'screw-retained' && (
                        <>
                            <p>Who will provide the Screw?</p>
                            <div className="flex gap-2">
                                <Button
                                    variant={localProviders['Screw'] === 'Doctor' ? 'default' : 'outline'}
                                    onClick={() => setProviderFor('Screw', 'Doctor')}
                                >
                                    Doctor
                                </Button>
                                <Button
                                    variant={localProviders['Screw'] === 'Lab' ? 'default' : 'outline'}
                                    onClick={() => setProviderFor('Screw', 'Lab')}
                                >
                                    Lab
                                </Button>
                            </div>
                            <p>Who will provide the Ti-base?</p>
                            <div className="flex gap-2">
                                <Button
                                    variant={localProviders['Ti-base'] === 'Doctor' ? 'default' : 'outline'}
                                    onClick={() => setProviderFor('Ti-base', 'Doctor')}
                                >
                                    Doctor
                                </Button>
                                <Button
                                    variant={localProviders['Ti-base'] === 'Lab' ? 'default' : 'outline'}
                                    onClick={() => setProviderFor('Ti-base', 'Lab')}
                                >
                                    Lab
                                </Button>
                            </div>
                        </>
                    )}
                    {selectedItemValue === 'cement-retained' && (
                        <>
                            {/* Step 1: Select abutment material */}
                            {!localAbutmentMaterial && (
                                <>
                                    <p>Select abutment material:</p>
                                    <div className="flex gap-2">
                                        <Button onClick={() => {
                                            setLocalAbutmentMaterial('Titanium Custom Abutment');
                                            setProviderFor('Abutment', 'Titanium Custom Abutment');
                                        }}>
                                            Titanium Custom Abutment
                                        </Button>
                                        <Button onClick={() => {
                                            setLocalAbutmentMaterial('Zirconia Custom Abutment');
                                            setProviderFor('Abutment', 'Zirconia Custom Abutment');
                                        }}>
                                            Zirconia Custom Abutment
                                        </Button>
                                    </div>
                                </>
                            )}
                            {/* Step 2: Ask who provides Premilled or Ti-base */}
                            {localAbutmentMaterial === 'Titanium Custom Abutment' && (
                                <>
                                    <p>Who Will Provide Premilled?</p>
                                    <Button onClick={() => setProviderFor('Premilled', 'Doctor')} variant={localProviders['Premilled'] === 'Doctor' ? 'default' : 'outline'}>
                                        Premilled by Doctor
                                    </Button>
                                    <Button onClick={() => setProviderFor('Premilled', 'Lab')} variant={localProviders['Premilled'] === 'Lab' ? 'default' : 'outline'}>
                                        Premilled by Lab
                                    </Button>
                                </>
                            )}
                            {localAbutmentMaterial === 'Zirconia Custom Abutment' && (
                                <>
                                    <p>Who Will Provide Ti-base?</p>
                                    <Button onClick={() => setProviderFor('Ti-base', 'Doctor')} variant={localProviders['Ti-base'] === 'Doctor' ? 'default' : 'outline'}>
                                        Ti-base By Doctor
                                    </Button>
                                    <Button onClick={() => setProviderFor('Ti-base', 'Lab')} variant={localProviders['Ti-base'] === 'Lab' ? 'default' : 'outline'}>
                                        Ti-base By Lab
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                    {selectedItemValue === 'screwmentable' && (
                        <>
                            {/* Step 1: Select abutment material */}
                            {!localAbutmentMaterial && (
                                <>
                                    <p>Select abutment material:</p>
                                    <div className="flex gap-2">
                                        <Button onClick={() => {
                                            setLocalAbutmentMaterial('Titanium Custom Abutment');
                                            setProviderFor('Abutment', 'Titanium Custom Abutment');
                                        }}>
                                            Titanium Custom Abutment
                                        </Button>
                                        <Button onClick={() => {
                                            setLocalAbutmentMaterial('Zirconia Custom Abutment');
                                            setProviderFor('Abutment', 'Zirconia Custom Abutment');
                                        }}>
                                            Zirconia Custom Abutment
                                        </Button>
                                    </div>
                                </>
                            )}
                            {/* Step 2: Ask who provides Premilled or Ti-base */}
                            {localAbutmentMaterial === 'Titanium Custom Abutment' && !showCementQuestion && (
                                <>
                                    <p>Who Will Provide Premilled?</p>
                                    <Button onClick={() => {
                                        setProviderFor('Premilled', 'Doctor');
                                        setShowCementQuestion(true);
                                    }} variant={localProviders['Premilled'] === 'Doctor' ? 'default' : 'outline'}>
                                        Premilled by Doctor
                                    </Button>
                                    <Button onClick={() => {
                                        setProviderFor('Premilled', 'Lab');
                                        setShowCementQuestion(true);
                                    }} variant={localProviders['Premilled'] === 'Lab' ? 'default' : 'outline'}>
                                        Premilled by Lab
                                    </Button>
                                </>
                            )}
                            {localAbutmentMaterial === 'Zirconia Custom Abutment' && !showCementQuestion && (
                                <>
                                    <p>Who Will Provide Ti-base?</p>
                                    <Button onClick={() => {
                                        setProviderFor('Ti-base', 'Doctor');
                                        setShowCementQuestion(true);
                                    }} variant={localProviders['Ti-base'] === 'Doctor' ? 'default' : 'outline'}>
                                        Ti-base By Doctor
                                    </Button>
                                    <Button onClick={() => {
                                        setProviderFor('Ti-base', 'Lab');
                                        setShowCementQuestion(true);
                                    }} variant={localProviders['Ti-base'] === 'Lab' ? 'default' : 'outline'}>
                                        Ti-base By Lab
                                    </Button>
                                </>
                            )}
                            {/* Step 3: Who will provide cement? */}
                            {showCementQuestion && (
                                <>
                                    <p>Who will provide cement?</p>
                                    <Button onClick={() => setProviderFor('Cement', 'Doctor')} variant={localProviders['Cement'] === 'Doctor' ? 'default' : 'outline'}>
                                        Doctor
                                    </Button>
                                    <Button onClick={() => setProviderFor('Cement', 'Lab')} variant={localProviders['Cement'] === 'Lab' ? 'default' : 'outline'}>
                                        Lab
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!isSaveEnabled()} className={isSaveEnabled() ? '' : 'opacity-50 cursor-not-allowed'}>
                        Save
                    </Button>
                </div>
            </BaseModal >
        </>
    );
};

export default ImplantTypeSelector;
