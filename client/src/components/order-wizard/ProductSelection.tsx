import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProductSearch from './ProductSearch';
import ShadeSelector, { ShadeOption } from './ShadeSelector';
import FormField from '@/components/shared/FormField';
import TrialSelector from './components/TrialSelector';
import ShadeGuideSection from './components/ShadeGuideSection';
import { CheckCircle, Plus, Pencil } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

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
  productName: string[];
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
    shadeGuide: [],
    productName: []
  });
  const [editingGroupIndex, setEditingGroupIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const  isMobile  = useIsMobile();

  console.log(' %c formData', 'background: #FF0000; color: white;', formData)

  // Always get the latest allGroups from formData
  const getAllGroups = () => {
    const toothGroups = formData.toothGroups || [];
    const groupedTeeth = new Set(toothGroups.flatMap((g: any) => g.teethDetails?.flat().map((t: any) => t.toothNumber) || []));
    const individualTeeth = (formData.selectedTeeth || []).map((t: any) => ({
      ...t,
      selectedProducts: t.selectedProducts || [],
      productDetails: t.productDetails || {},
    })).filter((t: any) => !groupedTeeth.has(t.toothNumber));
    const unconfiguredIndividualTeeth = individualTeeth.filter(
      (t: any) =>
        !(t.selectedProducts && t.selectedProducts.length > 0) &&
        !(t.productName && t.productName.length > 0)
    );
    let allGroups = [...toothGroups];
    if (unconfiguredIndividualTeeth.length > 0) {
      allGroups.push({
        groupType: 'individual',
        teethDetails: [unconfiguredIndividualTeeth],
        prescriptionType: formData.prescriptionType
      });
    }
    return allGroups;
  };
  const allGroups = getAllGroups();

  // Use allGroups for display/configuration logic below
  const isGroupConfigured = (group: any) => {
    const allTeeth = group.teethDetails?.flat() || [];
    const result = allTeeth.every((t: any) =>
      (t.selectedProducts && t.selectedProducts.length > 0) ||
      (t.productName && t.productName.length > 0)
    );
    if (!result) {
      console.log('Unconfigured group:', group, 'teeth:', allTeeth);
    }
    return result;
  };

  const allGroupsConfigured = allGroups.length > 0 && allGroups.every((group: any) => isGroupConfigured(group));
  console.log(allGroupsConfigured,"this is a all moasdaisdjasijd")
  // Get unconfigured groups only
  const unconfiguredGroups = allGroups.filter((group: any) => !isGroupConfigured(group));
  // Calculate total teeth count across unconfigured groups only
  const totalTeethCount = unconfiguredGroups.reduce((total: number, group: any) => {
    return total + (group.teethDetails?.flat().length || 0);
  }, 0);
  // Get teeth numbers from unconfigured groups only
  const allTeethNumbers = unconfiguredGroups.flatMap((group: any) => group.teethDetails?.flat().map((t: any) => t.toothNumber) || []);

  let editingTeethNumbers: number[] = [];
  if (isConfiguring) {
    if (editingGroupIndex !== null) {
      // Editing a specific group
      const group = allGroups[editingGroupIndex];
      editingTeethNumbers = group?.teethDetails?.flat().map((t: any) => t.toothNumber) || [];
    } else {
      // Editing all groups of a type
      editingTeethNumbers = allGroups.flatMap((g: any) => g.teethDetails?.flat().map((t: any) => t.toothNumber) || []);
    }
  } else {
    // Default to unconfigured groups
    editingTeethNumbers = unconfiguredGroups.flatMap((group: any) => group.teethDetails?.flat().map((t: any) => t.toothNumber) || []);
  }

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
      shadeGuide: [],
      productName: []
    });
  };

  const saveConfiguration = () => {
    try {
      const { trial, shade, shadeNotes, additionalNotes, shadeGuide, ...productDetailsWithoutExtras } = productDetails;
      let updatedGroups = [...allGroups];
      let updatedSelectedTeeth = [...formData.selectedTeeth];

      // Add ungrouped individual teeth as a 'separate' group if not already present
      const groupedTeeth = new Set(updatedGroups.flatMap((g: any) => g.teethDetails?.flat().map((t: any) => t.toothNumber) || []));
      const ungroupedIndividualTeeth = (updatedSelectedTeeth || []).filter((t: any) => !groupedTeeth.has(t.toothNumber));
      if (ungroupedIndividualTeeth.length > 0) {
        updatedGroups.push({
          groupType: 'individual',
          teethDetails: [ungroupedIndividualTeeth],
          teeth: ungroupedIndividualTeeth.map((t: any) => t.toothNumber),
          prescriptionType: formData.prescriptionType
        });
      }

      if (editingGroupIndex !== null) {
        const group = allGroups[editingGroupIndex];
        // Update every tooth in teethDetails with selected products and product names for all group types
        const updatedTeethDetails = group.teethDetails.map((arr: any) =>
          arr.map((tooth: any) => ({
            ...tooth,
            selectedProducts: [...selectedProducts],
            productName: selectedProducts.map((p: any) => p.name),
            productDetails: { ...productDetailsWithoutExtras, shade: productDetails.shade[0] || '', productName: selectedProducts.map((p: any) => p.name) },
          }))
        );
        updatedGroups = updatedGroups.map((g: any, idx: number) => {
          if (idx === editingGroupIndex) {
            return {
              ...g,
              teethDetails: updatedTeethDetails,
              prescriptionType: formData.prescriptionType
            };
          }
          return g;
        });
        // if (group.groupType === 'individual') {
        //   // Remove these teeth from selectedTeeth for individual group
        //   const individualTeethNumbers = updatedTeethDetails?.flat().map((t: any) => t.toothNumber) || [];
        //   updatedSelectedTeeth = updatedSelectedTeeth.filter((t: any) => !individualTeethNumbers.includes(t.toothNumber));
        // }
      } else {
        // Update all groups of the same type as the first group being edited
        const typeToEdit = formData.prescriptionType;
        updatedGroups = updatedGroups.map((group: any) => {
          if ((group.prescriptionType || formData.prescriptionType) === typeToEdit) {
            // Update all teeth in teethDetails
            const updatedTeethDetails = group.teethDetails.map((arr: any) =>
              arr.map((tooth: any) => ({
                ...tooth,
                selectedProducts: [...selectedProducts],
                productName: selectedProducts.map((p: any) => p.name),
                productDetails: { ...productDetailsWithoutExtras, shade: productDetails.shade[0] || '', productName: selectedProducts.map((p: any) => p.name) },
              }))
            );
            return {
              ...group,
              teethDetails: updatedTeethDetails,
              prescriptionType: formData.prescriptionType
            };
          }
          return group;
        });
      }

      // Build restorationProducts array by aggregating products across all configured groups and individual teeth
      const productMap: Record<string, { product: string; quantity: number }> = {};
      const accessoriesSet = new Set<string>();
      // Process regular groups
      updatedGroups.forEach((group: any) => {
        group.teethDetails?.flat().forEach((tooth: any) => {
          (tooth.selectedProducts || []).forEach((product: any) => {
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
        });
      });
      // Process individual teeth
      // updatedSelectedTeeth.forEach((t: any) => {
      //   (t.selectedProducts || []).forEach((product: any) => {
      //     if (productMap[product.name]) {
      //       productMap[product.name].quantity += 1;
      //     } else {
      //       productMap[product.name] = {
      //         product: product.name,
      //         quantity: 1,
      //       };
      //     }
      //     accessoriesSet.add(product.name);
      //   });
      // });
      const restorationProducts = Object.values(productMap);
      const accessories = Array.from(accessoriesSet);

      setFormData({
        ...formData,
        toothGroups: updatedGroups,
        selectedTeeth: updatedSelectedTeeth,
        restorationProducts,
        accessories,
        trial: productDetails.trial,
        shade: productDetails.shade,
        shadeNotes: productDetails.shadeNotes,
        additionalNotes: productDetails.additionalNotes,
        shadeGuide: productDetails.shadeGuide,
        productName: selectedProducts.map((p: any) => p.name),
      });

      // Reset editing state
      setIsConfiguring(false);
      setSelectedProducts([selectedProducts[selectedProducts.length - 1]]);
      setProductDetails({
        shade: [],
        occlusalStaining: 'medium',
        ponticDesign: '',
        notes: '',
        trial: '',
        shadeNotes: '',
        additionalNotes: '',
        shadeGuide: [],
        productName: []
      });
      setEditingGroupIndex(null); // Reset editing state

      // After updating allGroups in saveConfiguration, add a debug log
      console.log('After save, allGroups:', updatedGroups);
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
      shadeGuide: [],
      productName: []
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

  useEffect(() => {
    if (!isConfiguring && unconfiguredGroups.length > 0) {
      console.log('unconfiguredGroups', unconfiguredGroups);
      startConfiguring();
    }
    // Optionally, add dependencies if you want to trigger on step change
    // eslint-disable-next-line
  }, []);

  console.log('4444444 allGroups', allGroups)

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
                          setIsConfiguring(!isConfiguring);
                          // Aggregate all products from all groups of this type
                          const allProducts = groups.flatMap(g => g.selectedProducts || []);
                          setSelectedProducts(allProducts);
                          setProductDetails({
                            ...groups[0].productDetails,
                            shade: formData.shade || [],
                            trial: formData.trial || '',
                            shadeNotes: formData.shadeNotes || '',
                            additionalNotes: formData.additionalNotes || '',
                            shadeGuide: formData.shadeGuide || [],
                            productName: allProducts.map((p: any) => p.name)
                          });
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button type="button" className="p-1 text-gray-400 hover:text-green-600"
                        onClick={() => {
                          toast({
                            title: 'Group already configured',
                            description: 'This group has already been configured. You can edit it using the pencil icon.'
                          });
                        }}
                        aria-label="Group already configured"
                      >
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Teeth:</p>
                      <div className="text-gray-600">
                        {['joint', 'bridge', 'individual'].map(type => {
                          const groupsOfType = groups.filter((g: any) => g.groupType === type);
                          if (groupsOfType.length === 0) return null;
                          const teethNumbers = groupsOfType
                            .flatMap((g: any) => g.teethDetails?.flat() || [])
                            .map((t: any) => t.toothNumber ?? t.teethNumber)
                            .filter((n: any) => n !== undefined && n !== null && n !== '')
                            .join(', ');
                          return (
                            <div key={type}>
                              <span className="font-semibold capitalize">{type}:</span> {teethNumbers}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Products:</p>
                      {(() => {
                        // Aggregate all product names across all teeth in all groups
                        const productMap: Record<string, number> = {};
                        groups.forEach((group: any) => {
                          group.teethDetails?.flat().forEach((tooth: any) => {
                            (tooth.productName || []).forEach((name: string) => {
                              productMap[name] = (productMap[name] || 0) + 1;
                            });
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
                        {/* Show all unique shades for this group */}
                        {(() => {
                          const shades = Array.from(new Set(groups.flatMap((g: any) => g.teethDetails?.flat().map((t: any) => t.productDetails?.shade).filter(Boolean))));
                          return shades.length > 0 ? shades.join(', ') : 'Not specified';
                        })()}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Occlusal Staining:</p>
                      <p className="text-gray-600 capitalize">
                        {(() => {
                          const stainings = Array.from(new Set(groups.flatMap((g: any) => g.teethDetails?.flat().map((t: any) => t.productDetails?.occlusalStaining).filter(Boolean))));
                          if (stainings.length === 1) return stainings[0];
                          if (stainings.length > 1) return 'Multiple';
                          return 'Not specified';
                        })()}
                      </p>
                    </div>
                  </div>
                  {/* Notes: show all notes concatenated if present */}
                  {(() => {
                    const notes = groups.flatMap((g: any) => g.teethDetails?.flat().map((t: any) => t.productDetails?.notes).filter(Boolean));
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
                    <div key={index} className={`flex border h-10 py-3 px-5 items-center text-white ${group.groupType === 'individual' ? 'bg-[#1D4ED8] border-[#4574F9]' : group.groupType === 'joint' ? 'bg-[#0B8043] border-[#10A457]' : 'bg-[#EA580C] border-[#FF7730]'} rounded-lg w-fit capitalize`}>
                      <div>
                        <span className="font-medium">{group.groupType}:</span>
                        <span className=" ml-2"> 
                          {group.teethDetails?.flat().map((t: any) => t.toothNumber ?? t.teethNumber).filter((n: any) => n !== undefined && n !== null && n !== '').join(', ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Single Product Configuration Box - Only show if there are unconfigured groups */}
          {isConfiguring && (
            <Card className="border-none p-0">
              <CardContent className="p-0">
                <div className="space-y-4">
                  {/* Product Selection */}
                  <ProductSearch
                    selectedProducts={selectedProducts}
                    onProductsChange={setSelectedProducts}
                    selectedTeeth={editingTeethNumbers}
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