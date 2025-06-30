import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProductSearch from './ProductSearch';
import ShadeSelector, { ShadeOption } from './ShadeSelector';
import FormField from '@/components/shared/FormField';
import TrialSelector from './components/TrialSelector';
import ShadeGuideSection from './components/ShadeGuideSection';
import { CheckCircle, Plus, Pencil } from 'lucide-react';

interface ProductSelectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

interface SelectedProduct {
  id: string;
  name: string;
  category: string;
  material: string;
  description: string;
  quantity: number;
}

interface ProductDetails {
  shade: ShadeOption | null;
  occlusalStaining: string;
  ponticDesign: string;
  notes: string;
  selectedTrials: string[];
}

const ProductSelection = ({ formData, setFormData }: ProductSelectionProps) => {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [productDetails, setProductDetails] = useState<ProductDetails>({
    shade: null,
    occlusalStaining: 'medium',
    ponticDesign: '',
    notes: '',
    selectedTrials: []
  });

  // --- BEGIN: Compose all groups including individual teeth ---
  const toothGroups = formData.toothGroups || [];
  const selectedTeeth = formData.selectedTeeth || [];

  // Find all teeth in groups (bridge/joint)
  const groupedTeeth = new Set<number>(toothGroups.flatMap((g: any) => g.teeth || []));
  // Find individual teeth (not in any group)
  const individualTeeth = selectedTeeth.filter((t: any) => !groupedTeeth.has(t.toothNumber));
  // Compose all groups: bridge/joint + individual (all individual teeth in one group)
  let allGroups = [...toothGroups];
  if (individualTeeth.length > 0) {
    allGroups.push({
      groupId: 'individual-group',
      teeth: individualTeeth.map((t: any) => t.toothNumber),
      type: 'individual',
      // Optionally add more fields if needed for config compatibility
    });
  }
  // --- END: Compose all groups including individual teeth ---

  // Use allGroups for display/configuration logic below
  const isGroupConfigured = (group: any) => {
    return group.selectedProducts && 
           group.selectedProducts.length > 0 && 
           group.productDetails && 
           group.productDetails.shade;
  };

  const allGroupsConfigured = allGroups.length > 0 && allGroups.every((group: any) => isGroupConfigured(group));

  // Get unconfigured groups only
  const unconfiguredGroups = allGroups.filter((group: any) => !isGroupConfigured(group));
  // Calculate total teeth count across unconfigured groups only
  const totalTeethCount = unconfiguredGroups.reduce((total: number, group: any) => {
    return total + (group.teeth?.length || 0);
  }, 0);
  // Get teeth numbers from unconfigured groups only
  const allTeethNumbers = unconfiguredGroups.flatMap((group: any) => group.teeth || []);

  const handleProductDetailsChange = (field: keyof ProductDetails, value: any) => {
    setProductDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTrialsChange = (trials: string[]) => {
    setProductDetails(prev => ({
      ...prev,
      selectedTrials: trials
    }));
  };

  const startConfiguring = () => {
    setIsConfiguring(true);
    // Start fresh for each new configuration session
    // Don't pre-load existing configurations to allow different products for different groups
    setSelectedProducts([]);
    setProductDetails({
      shade: null,
      occlusalStaining: 'medium',
      ponticDesign: '',
      notes: '',
      selectedTrials: []
    });
  };

  const saveConfiguration = () => {
    try {
      // Only update real groups in formData.toothGroups (bridge/joint)
      const updatedGroups = (formData.toothGroups || []).map((group: any) => {
        if (!isGroupConfigured(group)) {
          return {
            ...group,
            selectedProducts: [...selectedProducts],
            productDetails: { ...productDetails }
          };
        }
        return group; // Keep already configured groups unchanged
      });

      // Build restorationProducts array by aggregating products across all configured groups (including individual teeth for display)
      const productMap: Record<string, { product: string; quantity: number }> = {};
      const accessoriesSet = new Set<string>();
      allGroups.forEach((group: any) => {
        if (group.selectedProducts && group.selectedProducts.length > 0) {
          group.selectedProducts.forEach((product: any) => {
            if (productMap[product.name]) {
              productMap[product.name].quantity += product.quantity;
            } else {
              productMap[product.name] = {
                product: product.name,
                quantity: product.quantity
              };
            }
            accessoriesSet.add(product.name);
          });
        }
      });
      const restorationProducts = Object.values(productMap);
      const accessories = Array.from(accessoriesSet);

      setFormData({
        ...formData,
        toothGroups: updatedGroups, // Only real groups, never merged individual
        restorationProducts,
        accessories,
        selectedTeeth: formData.selectedTeeth // Always preserve selectedTeeth
      });

      // Reset editing state
      setIsConfiguring(false);
      setSelectedProducts([]);
      setProductDetails({
        shade: null,
        occlusalStaining: 'medium',
        ponticDesign: '',
        notes: '',
        selectedTrials: []
      });
    } catch (error) {
      console.error('Error saving configuration:', error);
      // Don't crash the app, just log the error
    }
  };

  const cancelConfiguring = () => {
    setIsConfiguring(false);
    setSelectedProducts([]);
    setProductDetails({
      shade: null,
      occlusalStaining: 'medium',
      ponticDesign: '',
      notes: '',
      selectedTrials: []
    });
  };

  const addMoreProducts = () => {
    if (formData.onAddMoreProducts) {
      // Pass existing teeth for visual reference in tooth selector
      const existingTeeth = allTeethNumbers;
      formData.onAddMoreProducts(existingTeeth);
    }
  };

  const saveRestorationInfo = () => {
    const restorationInfo = {
      prescriptionType: formData.prescriptionType,
      orderMethod: formData.orderMethod,
      toothGroups: formData.toothGroups,
      completedAt: new Date().toISOString()
    };
    
    setFormData({
      ...formData,
      restorationInfo
    });
  };

  return (
    <div className="space-y-6">
      {allGroups.length > 0 ? (
        <>
          {/* Completion Status */}
          {allGroupsConfigured && (
            <Card className="border border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">
                    Product configuration completed for all {allGroups.length} group{allGroups.length > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-sm text-green-600 mt-1">Ready to proceed to next step</p>
              </CardContent>
            </Card>
          )}

          {/* Configured Groups Detail Cards - Compact View */}
          {allGroups.filter((group: any) => isGroupConfigured(group)).map((group: any, index: number) => (
            <Card key={index} className="border border-green-200 bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                      {formData.prescriptionType === 'crown-bridge' ? 'Crown & Bridge' : 'Implant'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1 text-gray-400 hover:text-blue-600">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Teeth:</p>
                    <p className="text-gray-600">{group.teeth?.join(', ')}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Products:</p>
                    {group.selectedProducts?.map((product: any, pIndex: number) => (
                      <p key={pIndex} className="text-gray-600">
                        {product.name} x {group.teeth?.length || 0}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Shade:</p>
                    <p className="text-gray-600 uppercase">
                      {group.productDetails?.shade?.label || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Occlusal Staining:</p>
                    <p className="text-gray-600 capitalize">
                      {group.productDetails?.occlusalStaining || 'Not specified'}
                    </p>
                  </div>
                </div>

                {group.productDetails?.notes && (
                  <div className="mt-3 text-sm">
                    <p className="font-medium text-gray-900 mb-1">Notes:</p>
                    <p className="text-gray-600 italic text-xs leading-relaxed">
                      {group.productDetails.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Tooth Groups Summary for unconfigured groups */}
          {unconfiguredGroups.length > 0 && (
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Pending Configuration</CardTitle>
                <CardDescription>Groups waiting to be configured</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {unconfiguredGroups.map((group: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">Group {allGroups.indexOf(group) + 1}:</span>
                        <span className="text-gray-600 ml-2">
                          Teeth {group.teeth?.join(', ')} - {group.type}
                        </span>
                      </div>
                      <span className="text-orange-600 text-sm">Pending</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Single Product Configuration Box - Only show if there are unconfigured groups */}
          {unconfiguredGroups.length > 0 && (
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Product Configuration</span>
                  {allGroupsConfigured && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </CardTitle>
                <CardDescription>
                  Configure products for {unconfiguredGroups.length} tooth group{unconfiguredGroups.length > 1 ? 's' : ''} 
                  ({totalTeethCount} teeth total: {allTeethNumbers.join(', ')})
                </CardDescription>
              </CardHeader>
              <CardContent>
              {isConfiguring ? (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900">Configure Products</h4>

                  {/* Product Selection */}
                  <ProductSearch
                    selectedProducts={selectedProducts}
                    onProductsChange={setSelectedProducts}
                    selectedTeeth={allTeethNumbers}
                    restorationType="separate"
                  />

                  {/* Product Details Form */}
                  {selectedProducts.length > 0 && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                      <h5 className="text-sm font-medium text-gray-900">Product Details</h5>

                      {/* Shade Selection */}
                      <ShadeSelector
                        value={productDetails.shade}
                        onValueChange={(value) => handleProductDetailsChange('shade', value)}
                        label="Shade"
                        placeholder="Select Shade"
                      />

                      {/* Occlusal Staining */}
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

                      {/* Trial Requirements */}
                      <TrialSelector
                        productType={formData.prescriptionType === 'implant' ? 'implant' : 'crown-bridge'}
                        selectedTrials={productDetails.selectedTrials}
                        onTrialsChange={handleTrialsChange}
                      />

                      {/* Shade Guide Section */}
                      <div className="border-t pt-4">
                        <h6 className="text-sm font-medium text-gray-900 mb-3">Shade Guide</h6>
                        <ShadeGuideSection selectedGroups={[]} />
                      </div>

                      {/* Additional Notes */}
                      <FormField
                        id="notes"
                        label="Shade Notes"
                        type="textarea"
                        value={productDetails.notes}
                        onChange={(value) => handleProductDetailsChange('notes', value)}
                        placeholder="Any special instructions for shade..."
                        rows={3}
                      />

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button 
                          type="button"
                          onClick={cancelConfiguring}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="button"
                          onClick={saveConfiguration}
                          className="flex-1 bg-[#11AB93] hover:bg-[#0F9A82] text-white"
                          disabled={!productDetails.shade?.value || selectedProducts.length === 0}
                        >
                          Save Configuration
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {allGroupsConfigured ? (
                    <div className="space-y-3">
                      <div className="text-center py-4">
                        <div className="text-green-600 font-medium mb-2">
                          ✓ All tooth groups configured successfully
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          Each tooth group has been configured with products and details.
                        </p>
                        <Button 
                          onClick={startConfiguring}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Pencil className="w-4 h-4" />
                          Configure Additional Products
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 mb-3">Configure products for all tooth groups</p>
                      <Button 
                        onClick={startConfiguring}
                        className="bg-[#11AB93] hover:bg-[#0F9A82] text-white"
                      >
                        Configure Products
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          )}

          {/* Add More Products Button */}
          {allGroupsConfigured && (
            <Card className="border-2 border-dashed border-gray-300 hover:border-[#11AB93] transition-colors">
              <CardContent className="p-6 text-center">
                <Button 
                  onClick={addMoreProducts}
                  variant="outline"
                  className="flex items-center gap-2 mx-auto text-[#11AB93] border-[#11AB93] hover:bg-[#11AB93] hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                  Add more product
                </Button>
                <p className="text-sm text-gray-500 mt-2">Configure additional teeth with different products</p>
              </CardContent>
            </Card>
          )}

          

          
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {allGroups.length === 0 
              ? "Please complete teeth selection in the previous step" 
              : "All tooth groups are already configured"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductSelection;