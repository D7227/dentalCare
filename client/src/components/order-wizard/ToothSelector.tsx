import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ToothChart from './components/ToothChart';
import ToothSelectionControls from './components/ToothSelectionControls';
import SelectedToothGroups from './components/SelectedToothGroups';
import ShadeGuideSection from './components/ShadeGuideSection';
import ProductSearch from './ProductSearch';
import ShadeSelector from './ShadeSelector';
import FormField from '@/components/shared/FormField';
import TrialSelector from './components/TrialSelector';
import { ToothGroup } from './types/tooth';

interface ToothSelectorProps {
  selectedGroups: ToothGroup[];
  onGroupsChange: (groups: ToothGroup[]) => void;
  onProductComplete?: () => void;
}

interface SelectedProduct {
  id: string;
  name: string;
  category: string;
  material: string;
  description: string;
  quantity: number;
}

const ToothSelector = ({ selectedGroups, onGroupsChange, onProductComplete }: ToothSelectorProps) => {
  const [tempSelection, setTempSelection] = useState<number[]>([]);
  const [showRestorationType, setShowRestorationType] = useState(false);
  const [selectedRestorationType, setSelectedRestorationType] = useState<'separate' | 'joint' | 'bridge' | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [productDetails, setProductDetails] = useState({
    shade: '',
    occlusalStaining: 'medium',
    ponticDesign: '',
    notes: '',
    selectedTrials: []
  });

  // Store productType per active group instead of globally
  const [activeProductType, setActiveProductType] = useState<'implant' | 'crown-bridge' | null>(null);

  // Active group state for real-time updates
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

  // Editing state
  const [editingGroup, setEditingGroup] = useState<ToothGroup | null>(null);

  // Recalculate product quantities when restoration type or teeth selection changes
  useEffect(() => {
    if (selectedProducts.length > 0 && selectedRestorationType && tempSelection.length > 0) {
      const calculatedQuantity = selectedRestorationType === 'separate' ? tempSelection.length : 1;

      const updatedProducts = selectedProducts.map(product => ({
        ...product,
        quantity: calculatedQuantity
      }));

      setSelectedProducts(updatedProducts);
    }
  }, [selectedRestorationType, tempSelection.length]);

  // Only create groups when explicitly finalized, not automatically

  const isToothSelected = (toothNumber: number) => {
    return selectedGroups.some(group => group.teeth.includes(toothNumber)) || 
           tempSelection.includes(toothNumber);
  };

  const handleToothClick = (toothNumber: number) => {
    // Don't allow tooth selection if no product type is selected
    if (!activeProductType) {
      return;
    }

    // Allow selection even if tooth is already in a group (for multiple products)
    if (tempSelection.includes(toothNumber)) {
      setTempSelection(tempSelection.filter(t => t !== toothNumber));
    } else {
      setTempSelection([...tempSelection, toothNumber]);
    }

    // Show restoration type options when teeth are selected
    if (tempSelection.length > 0 || !tempSelection.includes(toothNumber)) {
      setShowRestorationType(true);
    } else {
      setShowRestorationType(false);
    }
  };

  const handleRestorationTypeSelect = (type: 'separate' | 'joint' | 'bridge') => {
    setSelectedRestorationType(type);
  };

  // Edit functionality handlers
  const handleEditGroup = (group: ToothGroup) => {
    setEditingGroup(group);
    setActiveProductType(group.productType);
    setTempSelection(group.teeth);
    setSelectedRestorationType(group.type);
    setSelectedProducts(group.products || []);
    setProductDetails({
      shade: group.shade || '',
      occlusalStaining: 'medium',
      ponticDesign: '',
      notes: group.notes || '',
      selectedTrials: group.selectedTrials || []
    });
    setShowRestorationType(true);
  };

  const saveEditedGroup = () => {
    if (!editingGroup) return;

    const updatedGroup: ToothGroup = {
      ...editingGroup,
      teeth: tempSelection,
      type: selectedRestorationType || 'separate',
      products: selectedProducts,
      shade: productDetails.shade,
      notes: productDetails.notes,
      productType: activeProductType || editingGroup.productType,
      selectedTrials: productDetails.selectedTrials
    };

    const updatedGroups = selectedGroups.map(group => 
      group.groupId === editingGroup.groupId ? updatedGroup : group
    );

    onGroupsChange(updatedGroups);

    // Reset states
    setEditingGroup(null);
    setActiveProductType(null);
    setTempSelection([]);
    setSelectedRestorationType(null);
    setSelectedProducts([]);
    setProductDetails({
      shade: '',
      occlusalStaining: 'medium',
      ponticDesign: '',
      notes: '',
      selectedTrials: []
    });
    setShowRestorationType(false);
  };

  const cancelEdit = () => {
    setEditingGroup(null);
    setActiveProductType(null);
    setTempSelection([]);
    setSelectedRestorationType(null);
    setSelectedProducts([]);
    setProductDetails({
      shade: '',
      occlusalStaining: 'medium',
      ponticDesign: '',
      notes: '',
      selectedTrials: []
    });
    setShowRestorationType(false);
  };

  const finalizeGroup = () => {
    if (tempSelection.length === 0 || selectedProducts.length === 0 || !selectedRestorationType || !activeProductType) return;

    const sortedSelection = [...tempSelection].sort((a, b) => a - b);

    // Create the finalized group
    const groupId = activeGroupId || `group-${Date.now()}`;

    const newGroup: ToothGroup = {
      groupId: groupId,
      teeth: sortedSelection,
      type: selectedRestorationType,
      productType: activeProductType,
      notes: productDetails.notes,
      material: selectedProducts.map(p => `${p.name} (Qty: ${p.quantity})`).join(', '),
      shade: productDetails.shade,
      occlusalStaining: productDetails.occlusalStaining,
      ponticDesign: selectedRestorationType === 'bridge' ? productDetails.ponticDesign : undefined,
      products: selectedProducts,
      selectedTrials: productDetails.selectedTrials
    };

    // Add the finalized group to the list
    onGroupsChange([...selectedGroups, newGroup]);

    // Reset form for next product
    resetForm();

    if (onProductComplete) {
      onProductComplete();
    }
  };

  const resetForm = () => {
    setTempSelection([]);
    setShowRestorationType(false);
    setSelectedRestorationType(null);
    setActiveProductType(null);
    setSelectedProducts([]);
    setProductDetails({
      shade: '',
      occlusalStaining: 'medium',
      ponticDesign: '',
      notes: '',
      selectedTrials: []
    });
    setActiveGroupId(null);
  };

  const removeGroup = (groupId: string) => {
    onGroupsChange(selectedGroups.filter(group => group.groupId !== groupId));
    // If removing the active group, reset the form
    if (groupId === activeGroupId) {
      resetForm();
    }
  };

  const handleAddMoreProduct = () => {
    resetForm();
  };

  // Handle real-time product details updates
  const handleProductDetailsChange = (field: string, value: string) => {
    setProductDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle trials change
  const handleTrialsChange = (trials: string[]) => {
    setProductDetails(prev => ({
      ...prev,
      selectedTrials: trials
    }));
  };

  return (
    <div className="flex gap-6">
      {/* Main Tooth Selector - Flexible width */}
      <div className="flex-1">
        <Card className="border shadow-sm">
          <CardContent className="p-3">
            {/* Product Selection - Must be selected first */}
            {!activeProductType && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Select Product Type First</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="implant" 
                      name="product" 
                      value="implant" 
                      onChange={e => setActiveProductType('implant')} 
                      className="w-4 h-4 text-[#11AB93] border-gray-300 focus:ring-[#11AB93]" 
                    />
                    <label htmlFor="implant" className="text-sm">Implant</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="crown-bridge" 
                      name="product" 
                      value="crown-bridge" 
                      onChange={e => setActiveProductType('crown-bridge')} 
                      className="w-4 h-4 text-[#11AB93] border-gray-300 focus:ring-[#11AB93]" 
                    />
                    <label htmlFor="crown-bridge" className="text-sm">Crown & Bridge</label>
                  </div>
                </div>
              </div>
            )}

            {/* Show selected product type */}
            {activeProductType && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">
                    Adding: {activeProductType === 'implant' ? 'Implant' : 'Crown & Bridge'}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setActiveProductType(null);
                      resetForm();
                    }}
                    className="text-green-600 hover:text-green-700"
                  >
                    Change
                  </Button>
                </div>
              </div>
            )}

            {/* Tooth Selection Chart */}
            {activeProductType && (
              <div className="mb-4">
                <ToothChart
                  selectedGroups={selectedGroups}
                  tempSelection={tempSelection}
                  selectedRestorationType={selectedRestorationType}
                  onToothClick={handleToothClick}
                  isToothSelected={isToothSelected}
                />
              </div>
            )}

            {/* Selected Groups */}
            <SelectedToothGroups
              selectedGroups={selectedGroups}
              onRemoveGroup={removeGroup}
              onEditGroup={handleEditGroup}
            />
          </CardContent>
        </Card>
      </div>

      {/* Right Side Panel - Flexible width */}
      <div className="flex-1 space-y-4">
        {/* Selection Controls - Show if product is selected and there are temp selections */}
        {activeProductType && (
          <Card className="border shadow-sm">
            <CardContent className="p-3">
              <ToothSelectionControls
                tempSelection={tempSelection}
                showRestorationType={showRestorationType}
                selectedRestorationType={selectedRestorationType}
                onCreateGroup={finalizeGroup}
                onRestorationTypeSelect={handleRestorationTypeSelect}
              />

              {/* Product Details Form - Real-time updates */}
              {selectedRestorationType && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900">Product Details</h4>

                  {/* 1. Product Selection with Multiple Products */}
                  <ProductSearch
                    selectedProducts={selectedProducts}
                    onProductsChange={setSelectedProducts}
                    selectedTeeth={tempSelection}
                    restorationType={selectedRestorationType || undefined}
                  />

                  {/* Product details form - only show if products are selected */}
                  {selectedProducts.length > 0 && (
                    <>
                      {/* 2. Shade Selection */}
                      <ShadeSelector
                        value={productDetails.shade}
                        onValueChange={(value) => handleProductDetailsChange('shade', value)}
                        label="Shade"
                        placeholder="Select Shade"
                      />

                      {/* 3. Occlusal Staining */}
                      <FormField
                        id="occlusalStaining"
                        label="Occlusal Staining"
                        type="select"
                        value={productDetails.occlusalStaining}
                        onChange={(value) => handleProductDetailsChange('occlusalStaining', value)}
                        options={[
                          { value: "light", label: "Light" },
                          { value: "medium", label: "Medium" },
                          { value: "heavy", label: "Heavy" }
                        ]}
                      />

                      {/* 4. Pontic Design - Only show for bridge */}
                      {selectedRestorationType === 'bridge' && (
                        <FormField
                          id="ponticDesign"
                          label="Pontic Design"
                          type="select"
                          value={productDetails.ponticDesign}
                          onChange={(value) => handleProductDetailsChange('ponticDesign', value)}
                          placeholder="Select Pontic Design"
                          options={[
                            { value: "ovate", label: "Ovate" },
                            { value: "ridge-lap", label: "Ridge Lap" },
                            { value: "sanitary", label: "Sanitary" },
                            { value: "modified-ridge-lap", label: "Modified Ridge Lap" }
                          ]}
                        />
                      )}

                      {/* 5. Trial Requirements */}
                      <TrialSelector
                        productType={activeProductType}
                        selectedTrials={productDetails.selectedTrials}
                        onTrialsChange={handleTrialsChange}
                      />

                      {/* 6. Additional Notes */}
                      <FormField
                        id="notes"
                        label="Additional Notes"
                        type="textarea"
                        value={productDetails.notes}
                        onChange={(value) => handleProductDetailsChange('notes', value)}
                        placeholder="Any special instructions or notes..."
                        rows={3}
                      />

                      {/* 7. Shade Guide Section */}
                      <div className="mt-4">
                        <ShadeGuideSection selectedGroups={selectedGroups} />
                      </div>

                      {/* Finalize Group Button */}
                      <div className="flex gap-2">
                        {editingGroup && (
                          <Button 
                            type="button"
                            onClick={cancelEdit}
                            variant="outline"
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        )}
                        <Button 
                          type="button"
                          onClick={editingGroup ? saveEditedGroup : finalizeGroup}
                          className="flex-1 bg-[#11AB93] hover:bg-[#0F9A82] text-white"
                          disabled={!productDetails.shade}
                        >
                          {editingGroup ? 'Save Changes' : 'Complete Product Group'}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Summary of completed groups */}
        {selectedGroups.length > 0 && !activeProductType && (
          <Card className="border shadow-sm bg-green-50 border-green-200">
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm font-medium text-green-800">
                  {selectedGroups.length} product group{selectedGroups.length > 1 ? 's' : ''} completed
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Ready to proceed to next step
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ToothSelector;