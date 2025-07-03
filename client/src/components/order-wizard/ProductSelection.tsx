import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProductSearch from './ProductSearch';
import ShadeSelector, { ShadeOption } from './ShadeSelector';
import FormField from '@/components/shared/FormField';
import TrialSelector from './components/TrialSelector';
import ShadeGuideSection from './components/ShadeGuideSection';
import { CheckCircle, Plus, Pencil } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductSelectionProps {
  formData: any;
  setFormData: (data: any) => void;
  onAddMoreProducts?: () => void;
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
  shade: string[];
  occlusalStaining: string;
  ponticDesign: string;
  notes: string;
  trial: string;
  shadeNotes?: string;
  additionalNotes?: string;
  shadeGuide?: string[];
}

const shadeOptions: ShadeOption[] = [
  { value: 'a1', label: 'A1 - Vita Classic', family: 'Vita Classic' },
  { value: 'a2', label: 'A2 - Vita Classic', family: 'Vita Classic' },
  { value: 'a3', label: 'A3 - Vita Classic', family: 'Vita Classic' },
  { value: 'a3.5', label: 'A3.5 - Vita Classic', family: 'Vita Classic' },
  { value: 'b1', label: 'B1 - Vita Classic', family: 'Vita Classic' },
  { value: 'b2', label: 'B2 - Vita Classic', family: 'Vita Classic' },
  { value: 'b3', label: 'B3 - Vita Classic', family: 'Vita Classic' },
  { value: 'c1', label: 'C1 - Vita Classic', family: 'Vita Classic' },
  { value: 'c2', label: 'C2 - Vita Classic', family: 'Vita Classic' },
  { value: 'd2', label: 'D2 - Vita Classic', family: 'Vita Classic' },
  { value: '1m1', label: '1M1 - Vita 3D Master', family: 'Vita 3D Master' },
  { value: '1m2', label: '1M2 - Vita 3D Master', family: 'Vita 3D Master' },
  { value: '2l1.5', label: '2L1.5 - Vita 3D Master', family: 'Vita 3D Master' },
  { value: '2l2.5', label: '2L2.5 - Vita 3D Master', family: 'Vita 3D Master' },
  { value: '2m1', label: '2M1 - Vita 3D Master', family: 'Vita 3D Master' },
  { value: '2m2', label: '2M2 - Vita 3D Master', family: 'Vita 3D Master' },
  { value: '3m1', label: '3M1 - Vita 3D Master', family: 'Vita 3D Master' },
  { value: '3m2', label: '3M2 - Vita 3D Master', family: 'Vita 3D Master' }
];

const ProductSelection = ({ formData, setFormData, onAddMoreProducts }: ProductSelectionProps) => {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [productDetails, setProductDetails] = useState<ProductDetails>({
    shade: [],
    occlusalStaining: 'medium',
    ponticDesign: '',
    notes: '',
    trial: '',
    shadeNotes: '',
    additionalNotes: '',
    shadeGuide: []
  });
  const [editingGroupIndex, setEditingGroupIndex] = useState<number | null>(null);

  const toothGroups = formData.toothGroups || [];
  const selectedTeeth = formData.selectedTeeth || [];
  const  isMobile  = useIsMobile();

  // Find all teeth in groups (bridge/joint)
  const groupedTeeth = new Set<number>(toothGroups.flatMap((g: any) => g.teeth || []));
  // Find individual teeth (not in any group)
  const individualTeeth = formData.selectedTeeth.filter((t: any) => !groupedTeeth.has(t.toothNumber));
  // Compose all groups: bridge/joint + individual (all individual teeth in one group)
  let allGroups = [...toothGroups];
  if (individualTeeth.length > 0) {
    allGroups.push({
      groupId: 'individual-group',
      teeth: individualTeeth.map((t: any) => t.toothNumber),
      type: 'individual',
      selectedProducts: individualTeeth[0]?.selectedProducts || [],
      productDetails: individualTeeth[0]?.productDetails || {},
      prescriptionType: formData.prescriptionType
    });
  }
  // --- END: Compose all groups including individual teeth as a single group ---

  // Use allGroups for display/configuration logic below
  const isGroupConfigured = (group: any) => {
    if (group.groupId === 'individual-group') {
      // Check if all individual teeth have products configured
      const individualTeeth = (formData.selectedTeeth || []).filter((t: any) => group.teeth.includes(t.toothNumber));
      return individualTeeth.length > 0 && individualTeeth.every((t: any) => t.selectedProducts && t.selectedProducts.length > 0);
    }
    return group.selectedProducts && 
           group.selectedProducts.length > 0 && 
           group.productDetails;
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
    setProductDetails(prev => {
      if (field === 'shade') {
        // Always store as array
        return { ...prev, shade: value ? [value.label || value] : [] };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleTrialsChange = (trials: string[]) => {
    setProductDetails(prev => ({
      ...prev,
      trial: trials && trials.length > 0 ? trials[0] : ''
    }));
  };

  const handleShadeGuideChange = (guideShades: string[]) => {
    setProductDetails(prev => {
      // Merge unique shade names from dropdown and guide
      const allShades = Array.from(new Set([...(prev.shadeGuide || []), ...guideShades]));
      return { ...prev, shadeGuide: allShades };
    });
    setFormData((prev: any) => ({
      ...prev,
      shadeGuide: guideShades
    }));
  };

  const startConfiguring = () => {
    setIsConfiguring(true);
    // Start fresh for each new configuration session
    // Don't pre-load existing configurations to allow different products for different groups
    setSelectedProducts([]);
    setProductDetails({
      shade: [],
      occlusalStaining: 'medium',
      ponticDesign: '',
      notes: '',
      trial: '',
      shadeNotes: '',
      additionalNotes: '',
      shadeGuide: []
    });
  };

  const saveConfiguration = () => {
    try {
      const { trial, shade, shadeNotes, additionalNotes, shadeGuide, ...productDetailsWithoutExtras } = productDetails;
      let updatedGroups = [...toothGroups];
      let updatedSelectedTeeth = [...formData.selectedTeeth];

      if (editingGroupIndex !== null) {
        const group = allGroups[editingGroupIndex];
        if (group.groupId === 'individual-group') {
          // Update all individual teeth
          const individualToothNumbers = group.teeth;
          updatedSelectedTeeth = updatedSelectedTeeth.map((t: any) =>
            individualToothNumbers.includes(t.toothNumber)
              ? {
                  ...t,
                  selectedProducts: [...selectedProducts],
                  productDetails: { ...productDetailsWithoutExtras, shade: productDetails.shade[0] || '' },
                }
              : t
          );
        } else {
          // Update only the group being edited
          updatedGroups = updatedGroups.map((group: any, idx: number) => {
            if (idx === editingGroupIndex) {
              return {
                ...group,
                selectedProducts: [...selectedProducts],
                productDetails: { ...productDetailsWithoutExtras },
                prescriptionType: formData.prescriptionType
              };
            }
            return group;
          });
        }
      } else {
        // Apply to all unconfigured groups (existing logic)
        updatedGroups = updatedGroups.map((group: any) => {
          if (!isGroupConfigured(group)) {
            return {
              ...group,
              selectedProducts: [...selectedProducts],
              productDetails: { ...productDetailsWithoutExtras },
              prescriptionType: formData.prescriptionType
            };
          }
          return group;
        });
        // Apply to all unconfigured individual teeth
        const individualGroup = allGroups.find((g: any) => g.groupId === 'individual-group');
        if (individualGroup) {
          updatedSelectedTeeth = updatedSelectedTeeth.map((t: any) => {
            if (!t.selectedProducts || t.selectedProducts.length === 0) {
              if (individualGroup.teeth.includes(t.toothNumber)) {
                return {
                  ...t,
                  selectedProducts: [...selectedProducts],
                  productDetails: { ...productDetailsWithoutExtras, shade: productDetails.shade[0] || '' },
                };
              }
            }
            return t;
          });
        }
      }

      // Build restorationProducts array by aggregating products across all configured groups and individual teeth
      const productMap: Record<string, { product: string; quantity: number }> = {};
      const accessoriesSet = new Set<string>();
      // Process regular groups
      updatedGroups.forEach((group: any) => {
        if (group.selectedProducts && group.selectedProducts.length > 0) {
          group.selectedProducts.forEach((product: any) => {
            // For group, quantity is number of teeth in the group
            if (productMap[product.name]) {
              productMap[product.name].quantity += group.teeth?.length || 0;
            } else {
              productMap[product.name] = {
                product: product.name,
                quantity: group.teeth?.length || 0,
              };
            }
            accessoriesSet.add(product.name);
          });
        }
      });
      // Process individual teeth
      updatedSelectedTeeth.forEach((t: any) => {
        if (t.selectedProducts && t.selectedProducts.length > 0) {
          t.selectedProducts.forEach((product: any) => {
            // For individual teeth, increment by 1 for each tooth that has the product
            if (productMap[product.name]) {
              productMap[product.name].quantity += 1;
            } else {
              productMap[product.name] = {
                product: product.name,
                quantity: 1,
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
        toothGroups: updatedGroups,
        selectedTeeth: updatedSelectedTeeth,
        restorationProducts,
        accessories,
        trial: productDetails.trial, // Set trial at the top level of formData
        shade: productDetails.shade, // Set shade at the top level of formData (array of strings)
        shadeNotes: productDetails.shadeNotes,
        additionalNotes: productDetails.additionalNotes,
        shadeGuide: productDetails.shadeGuide,
      });

      // Reset editing state
      setIsConfiguring(false);
      setSelectedProducts([]);
      setProductDetails({
        shade: [],
        occlusalStaining: 'medium',
        ponticDesign: '',
        notes: '',
        trial: '',
        shadeNotes: '',
        additionalNotes: '',
        shadeGuide: [],
      });
      setEditingGroupIndex(null); // Reset editing state
    } catch (error) {
      console.error('Error saving configuration:', error);
      // Don't crash the app, just log the error
    }
  };

  const cancelConfiguring = () => {
    setIsConfiguring(false);
    setSelectedProducts([]);
    setProductDetails({
      shade: [],
      occlusalStaining: 'medium',
      ponticDesign: '',
      notes: '',
      trial: '',
      shadeNotes: '',
      additionalNotes: '',
      shadeGuide: []
    });
    setEditingGroupIndex(null);
  };

  const addMoreProducts = () => {
    if (onAddMoreProducts) {
      onAddMoreProducts();
    } else {
      startConfiguring();
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

          {/* Configured Groups Detail Cards - Grouped by prescriptionType */}
          {allGroupsConfigured && (
            (Object.entries(
              allGroups.reduce((acc: any, group: any) => {
                const type = group.prescriptionType || formData.prescriptionType;
                if (!acc[type]) acc[type] = [];
                acc[type].push(group);
                return acc;
              }, {})
            ) as [string, any[]][]).map(([type, groups], idx) => (
              <Card key={type} className="border border-green-200 bg-gray-50 mb-4">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 ${type === 'implant' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'} text-xs rounded-full font-medium`}>
                        {type === 'implant' ? 'Implant' : 'Crown & Bridge'}
                      </span>
                    </div>
                    {/* Edit button for all groups at once (per type) */}
                    <div className="flex gap-2">
                      <button type="button" className="p-1 text-gray-400 hover:text-blue-600"
                        onClick={() => {
                          setEditingGroupIndex(null); // null means edit all
                          setIsConfiguring(true);
                          // Use the first group's products/details as a base
                          const firstGroup = groups[0];
                          setSelectedProducts(firstGroup.selectedProducts || []);
                          setProductDetails({
                            ...firstGroup.productDetails,
                            shade: formData.shade || [],
                            trial: formData.trial || '',
                            shadeNotes: formData.shadeNotes || '',
                            additionalNotes: formData.additionalNotes || '',
                            shadeGuide: formData.shadeGuide || [],
                          });
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button type="button" className="p-1 text-gray-400 hover:text-red-600">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Teeth:</p>
                      <p className="text-gray-600">
                        {(() => {
                          // Group teeth numbers by group type
                          const typeMap: Record<string, number[]> = {};
                          groups.forEach((g: any) => {
                            const gtype = g.type || 'individual';
                            if (!typeMap[gtype]) typeMap[gtype] = [];
                            typeMap[gtype].push(...(g.teeth || []));
                          });
                          return Object.entries(typeMap).map(([gtype, teeth]) => (
                            <div key={gtype}>
                              <span className="capitalize">{gtype}:</span> {teeth.join(', ')}
                            </div>
                          ));
                        })()}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Products:</p>
                      {(() => {
                        // Aggregate all products across groups of this type
                        const productMap: Record<string, number> = {};
                        groups.forEach((group: any) => {
                          (group.selectedProducts || []).forEach((product: any) => {
                            productMap[product.name] = (productMap[product.name] || 0) + (group.teeth?.length || 0);
                          });
                        });
                        return Object.entries(productMap).map(([name, count], i) => (
                          <p key={i} className="text-gray-600">{name} x {count}</p>
                        ));
                      })()}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Shade:</p>
                      <p className="text-gray-600 uppercase">
                        {/* Show all unique shades for this type */}
                        {(() => {
                          const shades = Array.from(new Set(groups.flatMap((g: any) => g.productDetails?.shade ? [g.productDetails.shade] : [])));
                          return shades.length > 0 ? shades.join(', ') : 'Not specified';
                        })()}
                        {/* Display shadeGuide values in column */}
                        {formData.shadeGuide?.length > 0 && (
                          <div className="flex flex-col mt-1">
                            {formData.shadeGuide.map((shade: any) => (
                              <span key={shade} className="text-gray-600 capitalize">
                                {shade}
                              </span>
                            ))}
                          </div>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Occlusal Staining:</p>
                      <p className="text-gray-600 capitalize">
                        {/* Show all unique occlusalStaining values across groups of this type */}
                        {(() => {
                          const stainings = Array.from(new Set(groups.map((g: any) => g.productDetails?.occlusalStaining || '').filter(Boolean)));
                          if (stainings.length === 1) return stainings[0];
                          if (stainings.length > 1) return 'Multiple';
                          return 'Not specified';
                        })()}
                      </p>
                    </div>
                  </div>
                  {/* Notes: show all notes concatenated if present */}
                  {(() => {
                    const notes = groups.map((g: any) => g.productDetails?.notes).filter(Boolean);
                    if (notes.length > 0) {
                      return (
                        <div className="mt-3 text-sm">
                          <p className="font-medium text-gray-900 mb-1">Notes:</p>
                          <p className="text-gray-600 italic text-xs leading-relaxed">
                            {notes.join(' | ')}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </CardContent>
              </Card>
            ))
          )}

          {/* Tooth Groups Summary for unconfigured groups */}
          {unconfiguredGroups.length > 0 && (
            <Card className="border-none p-0">
              <CardHeader className="pb-3 p-0">
                <CardTitle className="text-lg">Product Selection</CardTitle>
                <CardDescription>Groups waiting to be configured</CardDescription>
              </CardHeader>
              <CardContent className="p-0 mt-2">
                <div className="flex flex-wrap gap-2 items-center">
                  {unconfiguredGroups.map((group: any, index: number) => (
                    // <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    //   <div>
                    //     <span className="font-medium">Group {allGroups.indexOf(group) + 1}:</span>
                    //     <span className="text-gray-600 ml-2">s
                    //       Teeth {group.teeth?.join(', ')} - {group.type}
                    //     </span>
                    //   </div>
                    //   <span className="text-orange-600 text-sm">Pending</span>
                    // </div>
                    <div key={index} className={`flex border h-10 py-3 px-5 items-center text-white ${group.type === 'individual' ? 'bg-[#1D4ED8] border-[#4574F9]' : group.type === 'joint' ? 'bg-[#0B8043] border-[#10A457]' : 'bg-[#EA580C] border-[#FF7730]'} rounded-lg w-fit capitalize`}>
                    <div>
                      <span className="font-medium">{group.type}:</span>
                      <span className=" ml-2"> 
                        {group.teeth?.join(', ')}
                      </span>
                    </div>
                    {/* <span className="text-orange-600 text-sm">Pending</span> */}
                  </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Single Product Configuration Box - Only show if there are unconfigured groups */}
          {unconfiguredGroups.length > 0 && (
            <Card className="border-none p-0">
               {/* <CardHeader className="pb-3">
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
              </CardHeader> */}
              <CardContent className="p-0">
              {/* {isConfiguring ? ( */}
                <div className="space-y-4">
                  {/* <h4 className="text-sm font-semibold text-gray-900">Configure Products</h4> */}

                  {/* Product Selection */}
                  <ProductSearch
                    selectedProducts={selectedProducts}
                    onProductsChange={setSelectedProducts}
                    selectedTeeth={allTeethNumbers}
                    restorationType="separate"
                  />

                  {/* Product Details Form */}
                  {selectedProducts.length > 0 && (
                    <div className="mt-4 p-4 bg-[#EFF9F7] rounded-lg space-y-4">
                      <h5 className="text-sm font-medium text-gray-900">Shade Details</h5>

                      {/* Shade Selection */}
                      <ShadeSelector
                        value={shadeOptions.find(opt => opt.label === productDetails.shade[0]) || null}
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

                      {/* Shade Guide Section */}
                      <div className="border-t pt-4">
                        <h6 className="text-sm font-medium text-gray-900 mb-3">Shade Guide</h6>
                        <ShadeGuideSection selectedGroups={[]} onShadeGuideChange={handleShadeGuideChange} />
                      </div>

                      {/* Additional Notes */}
                      <FormField
                        id="shadeNotes"
                        label="Shade Notes"
                        type="textarea"
                        value={productDetails.shadeNotes || ''}
                        onChange={(value) => setProductDetails(prev => ({ ...prev, shadeNotes: value }))}
                        placeholder="Any special instructions for shade..."
                        rows={2}
                      />

                      {/* Trial Requirements */}
                      <TrialSelector
                        productType={formData.prescriptionType === 'implant' ? 'implant' : 'crown-bridge'}
                        selectedTrials={[productDetails.trial]}
                        onTrialsChange={handleTrialsChange}
                      />

                      {/* Action Buttons */}
                      <div className="flex gap-2 justify-end  flex-col sm:flex-row ">
                        {
                          isMobile && (
                            <Button 
                            type="button"
                            onClick={saveConfiguration}
                            className="bg-[#11AB93] hover:bg-[#0F9A82] text-white w-full sm:w-min px-4 py-3"
                            disabled={!productDetails.shade.length || selectedProducts.length === 0}
                          >
                            Save Configuration
                          </Button>
                          )
                        }
                        <Button 
                          type="button"
                          onClick={cancelConfiguring}
                          variant="outline"
                          className="w-full sm:w-min"
                        >
                          Cancel
                        </Button>
                        {
                          !isMobile && (
                            <Button 
                          type="button"
                          onClick={saveConfiguration}
                          className="bg-[#11AB93] hover:bg-[#0F9A82] text-white w-full sm:w-min px-4 py-3"
                          disabled={!productDetails.shade.length || selectedProducts.length === 0}
                        >
                          Save Configuration
                        </Button>
                          )
                        }
                        
                      </div>
                    </div>
                  )}
                </div>
              {/* ) : (
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
              )} */}
            </CardContent>
          </Card>
          )}

          {/* Add More Products Button */}
          {allGroupsConfigured && (
            <Card className="border-2 border-dashed border-gray-300 hover:border-[#11AB93] transition-colors">
              <CardContent className="p-6 text-center">
                <Button 
                  type="button"
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
            {toothGroups.length === 0 
              ? "Please complete teeth selection in the previous step" 
              : "All tooth groups are already configured"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductSelection;