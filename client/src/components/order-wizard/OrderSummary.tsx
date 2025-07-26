import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, CheckCircle, Plus, FileChartColumnIncreasing, User, ArchiveRestore, Wrench, FileText, Edit } from 'lucide-react';
import { OrderCategoryType } from './types/orderTypes';
import ToothChart from './components/ToothChart';
import { CrownBridgeTeeth, ImpantTeeth } from '@/assets/svg';
import { convertToLegacyGroups } from './ToothSelector';

interface OrderSummaryProps {
  formData: any;
  orderCategory: OrderCategoryType;
  onEditSection?: (step: number) => void;
  userType?: string;
  showHeading?: boolean
}

// Helper to build deduplicated, prioritized group list for summary
function buildSummaryGroups(toothGroups: any[], selectedTeeth: any[]) {
  // Priority: bridge > joint > individual
  const usedTeeth = new Set<number>();
  const summaryGroups: any[] = [];

  // Add bridge groups first, but only if teeth are not in selectedTeeth
  toothGroups.filter(g => g.type === 'bridge').forEach(group => {
    const teeth = group.teeth.filter((t: number) => !usedTeeth.has(t) && !selectedTeeth.some((st: any) => st.toothNumber === t));
    if (teeth.length > 0) {
      summaryGroups.push({ ...group, teeth });
      teeth.forEach((t: number) => usedTeeth.add(t));
    }
  });
  // Then joint groups, but only if teeth are not in selectedTeeth
  toothGroups.filter(g => g.type === 'joint').forEach(group => {
    const teeth = group.teeth.filter((t: number) => !usedTeeth.has(t) && !selectedTeeth.some((st: any) => st.toothNumber === t));
    if (teeth.length > 0) {
      summaryGroups.push({ ...group, teeth });
      teeth.forEach((t: number) => usedTeeth.add(t));
    }
  });
  // Then individual teeth
  const individualTeeth = selectedTeeth.filter((t: any) => !usedTeeth.has(t.toothNumber));
  if (individualTeeth.length > 0) {
    summaryGroups.push({
      groupId: 'individual-group',
      teeth: individualTeeth.map((t: any) => t.toothNumber),
      type: 'individual',
      material: '',
      shade: '',
      notes: '',
    });
    individualTeeth.forEach((t: any) => usedTeeth.add(t.toothNumber));
  }
  return summaryGroups;
}

// Helper for summary getToothType
function getSummaryToothType(toothNumber: number, summaryGroups: any[], selectedTeeth: any[]) {
  // Check bridge and joint groups first
  for (const group of summaryGroups) {
    const type = group.type || group.groupType;
    if (type === 'bridge' || type === 'joint') {
      if (group.teeth.includes(toothNumber)) {
        if (group.pontics && group.pontics.includes(toothNumber)) return 'pontic';
        return 'abutment';
      }
    }
  }
  // Then check individual
  const ind = selectedTeeth.find((t: any) => t.toothNumber === toothNumber);
  if (ind) return ind.type;
  return null;
}

// Helper: Safe no-op handlers for read-only summary
const noopToothClick = (toothNumber: number, event: React.MouseEvent) => { };
const noopGroupsChange = (groups: any[]) => { };
const noopSetSelectedTeeth = (fn: any) => { };
const noopDragConnection = (teeth: number[] | number, splitData?: any) => { };

const OrderSummary = ({ formData, orderCategory, onEditSection, userType, showHeading = true }: OrderSummaryProps) => {
  // Use convertToLegacyGroups for correct group conversion
  const selectedGroups = convertToLegacyGroups(formData.toothGroups || []);
  const selectedTeeth = (formData.selectedTeeth || []).map((t: any) => ({
    toothNumber: t.toothNumber,
    type: t.type || 'abutment',
  }));

  // --- Unified group logic for both toothGroups and selectedTeeth ---
  const selectedTeethGroups = (formData.selectedTeeth || []).length > 0
    ? Object.values(
      (formData.selectedTeeth || []).reduce((acc: any, tooth: any) => {
        const type = tooth.prescriptionType || formData.prescriptionType || "unknown";
        if (!acc[type]) acc[type] = { prescriptionType: type, groupType: "individual", teethDetails: [[]] };
        acc[type].teethDetails[0].push(tooth);
        return acc;
      }, {})
    )
    : [];

  const allGroups = [
    ...(formData.toothGroups || []),
    ...selectedTeethGroups
  ];

  const configuredGroups = allGroups.filter((group: any) => {
    const allTeeth = group.teethDetails?.flat() || [];
    return allTeeth.length > 0 && allTeeth.every((t: any) => {
      const hasSelectedProducts = t.selectedProducts && t.selectedProducts.length > 0;
      const hasProductName = t.productName && t.productName.length > 0;
      return hasSelectedProducts || hasProductName;
    });
  });

  const groupedByType = configuredGroups.reduce((acc: any, group: any) => {
    const type = group.prescriptionType || formData.prescriptionType || "unknown";
    if (!acc[type]) acc[type] = [];
    acc[type].push(group);
    return acc;
  }, {});

  const uniqueTypes = Array.from(new Set((formData.toothGroups || []).map((g: any) => g.prescriptionType)));
  const typeLabel = uniqueTypes.length > 1
    ? uniqueTypes.map(t => t === 'implant' ? 'Implant' : 'Crown & Bridge').join(', ')
    : (uniqueTypes[0] === 'implant' ? 'Implant' : 'Crown & Bridge');

  // Aggregate details from toothGroups
  const allTeeth = (formData.toothGroups || []).flatMap((g: any) => g.teethDetails?.flat() || []);
  const pontics = Array.from(new Set(allTeeth.map((t: any) => t.productDetails?.ponticDesign).filter(Boolean)));
  const trials = Array.from(new Set(allTeeth.map((t: any) => t.productDetails?.trial).filter(Boolean)));
  const occlusalStainings = Array.from(new Set(allTeeth.map((t: any) => t.productDetails?.occlusalStaining).filter(Boolean)));
  const shades = Array.from(new Set(allTeeth.map((t: any) => t.productDetails?.shade).filter(Boolean)));

  const shadeGuides = Array.from(new Set(
    allTeeth
      .flatMap((t: any) =>
        (t.productDetails?.shadeGuide && Array.isArray(t.productDetails.shadeGuide))
          ? t.productDetails.shadeGuide
          : (Array.isArray(t.shadeGuide) ? t.shadeGuide : [])
      )
      .filter(Boolean)
  ));

  const getCategoryTitle = () => {
    switch (orderCategory) {
      case 'new': return 'Review & Submit Order';
      case 'repeat': return 'Review & Submit Repeat Order';
      case 'repair': return 'Review & Submit Repair Request';
      default: return 'Review & Submit Order';
    }
  };

  const getCategoryColor = () => {
    switch (orderCategory) {
      case 'new': return 'bg-emerald-100 text-emerald-800';
      case 'repeat': return 'bg-blue-100 text-blue-800';
      case 'repair': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const EditButton = ({ onClick, label }: { onClick?: () => void; label: string }) => (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className="text-primary hover:bg-primary/10 print:hidden h-8 px-2 max-w-min"
    >
      <Edit2 size={12} className="mr-1" />
      Edit
    </Button>
  );

  const legacyGroups = convertToLegacyGroups(allGroups);

  return (
    <div className="max-w-6xl mx-auto space-y-6 print:space-y-4">
      {/* Header */}
      {
        userType === "Qa" ?
          null
          :
          (showHeading &&
            <div className="flex items-center justify-between mb-2">
              <div className="text-center w-full">
                <h1 className="text-2xl font-bold text-gray-900 print:text-xl">Review and Submit Order</h1>
              </div>
            </div>
          )
      }
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Left: Tooth Chart with Quadrant Labels */}
        <div className="space-y-4 print:space-y-3 w-full md:w-[350px] flex-shrink-0">
          <Card className="border-2 border-dashed border-green-300 bg-green-50 w-full md:w-[350px]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-green-700">
                  Adding: {typeLabel}
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onEditSection?.(2)}
                  className="text-green-600 border-green-300 hover:bg-green-100 print:hidden h-7 px-2 text-xs"
                >
                  Change
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ToothChart
                selectedGroups={legacyGroups}
                selectedTeeth={selectedTeeth}
                onToothClick={noopToothClick}
                isToothSelected={(toothNumber) => {
                  // Check if tooth is in any group or individual teeth
                  const inGroups = legacyGroups.some((group) =>
                    group.teeth?.includes(toothNumber)
                  );
                  const inIndividual = selectedTeeth.some(
                    (t: any) => t.toothNumber === toothNumber,
                  );
                  return inGroups || inIndividual;
                }}
                getToothType={(toothNumber) =>
                  getSummaryToothType(toothNumber, legacyGroups, selectedTeeth)
                }
                onGroupsChange={noopGroupsChange}
                setSelectedTeeth={noopSetSelectedTeeth}
                onDragConnection={noopDragConnection}
              />
            </CardContent>
          </Card>
          {/* Accessories */}
          <Card className="shadow-sm w-full md:w-[350px] p-3">
            <CardHeader className=" print:pb-2 p-0 pb-3">
              <div className="flex items-center justify-between">
                <div className='flex items-center gap-2'>
                  <div className="p-2 border bg-[#1D4ED826] text-[#1D4ED8] h-[32px] w-[32px] rounded-[6px]">
                    <Wrench className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-gray-900">Accessories</CardTitle>
                </div>
                <div className='h-8 w-8 text-center border border-[#DEDDDD] rounded-sm flex items-center justify-center'>
                  <Edit2 size={12} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2 print:space-y-1 p-0">
              {formData.accessorios && Array.isArray(formData.accessorios) && formData.accessorios.length > 0 ? (
                <div className="space-y-1">
                  {formData.accessorios.map((accessory: any, index: number) => (
                    <div key={accessory.id || index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-900 capitalize text-base">{accessory.name}</span>
                      <span className="text-gray-600 text-base">Qty: {accessory.quantity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">No accessories selected</div>
              )}
            </CardContent>
          </Card>

          {/* Product Quantities Summary */}
          {(() => {
            const productMap: Record<string, number> = {};
            (formData.toothGroups || []).forEach((group: any) => {
              group.teethDetails?.flat().forEach((tooth: any) => {
                let counted = false;
                if (
                  tooth.selectedProducts &&
                  Array.isArray(tooth.selectedProducts) &&
                  tooth.selectedProducts.length > 0
                ) {
                  tooth.selectedProducts.forEach((prod: any) => {
                    if (prod && prod.name) {
                      productMap[prod.name] = (productMap[prod.name] || 0) + 1;
                      counted = true;
                    }
                  });
                }
                if (
                  !counted &&
                  tooth.productName &&
                  Array.isArray(tooth.productName)
                ) {
                  tooth.productName.forEach((name: string) => {
                    if (name) {
                      productMap[name] = (productMap[name] || 0) + 1;
                    }
                  });
                }
              });
            });

            // Also count from selectedTeeth for individual teeth
            (formData.selectedTeeth || []).forEach((tooth: any) => {
              if (
                tooth.selectedProducts &&
                Array.isArray(tooth.selectedProducts)
              ) {
                tooth.selectedProducts.forEach((prod: any) => {
                  if (prod && prod.name) {
                    productMap[prod.name] = (productMap[prod.name] || 0) + 1;
                  }
                });
              } else if (
                tooth.productName &&
                Array.isArray(tooth.productName)
              ) {
                tooth.productName.forEach((name: string) => {
                  if (name) {
                    productMap[name] = (productMap[name] || 0) + 1;
                  }
                });
              }
            });

            const productQuantities = Object.entries(productMap).map(
              ([name, quantity]) => ({
                name,
                quantity,
              }),
            );

            if (productQuantities.length > 0) {
              return (
                <Card className="shadow-sm w-full md:w-[350px] p-3">
                  <CardHeader className="print:pb-2 p-0 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 border bg-[#1D4ED826] text-[#1D4ED8] h-[32px] w-[32px] rounded-[6px]">
                          <FileChartColumnIncreasing className="h-4 w-4" />
                        </div>
                        <CardTitle className="text-sm font-semibold text-gray-900">
                          Product Quantities
                        </CardTitle>
                      </div>
                      <div className="h-8 w-8 text-center border border-[#DEDDDD] rounded-sm flex items-center justify-center">
                        <Edit2 size={12} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2 print:space-y-1 p-0">
                    <div className="space-y-2">
                      {productQuantities.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between p-2 bg-white rounded border border-gray-100"
                        >
                          <span className="text-sm font-medium text-gray-700">
                            {item.name}
                          </span>
                          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            X {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            }
            return null;
          })()}
        </div>

        {/* Right: Stacked Info Cards */}
        <div className="flex-1 space-y-4 print:space-y-3 w-full">
          {/* Case Details */}
          <Card className="shadow-sm p-3">
            <CardHeader className="print:pb-2 p-0 pb-3">
              <div className="flex items-center justify-between">
                <div className='flex items-center gap-2'>
                  <div className="p-2 border bg-[#1D4ED826] text-[#1D4ED8] h-[32px] w-[32px] rounded-[6px]">
                    <User className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-gray-900">Case Details</CardTitle>
                </div>
                <div className='h-8 w-8 text-center border border-[#DEDDDD] rounded-sm flex items-center justify-center'>
                  <Edit2 size={12} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2 print:space-y-1 p-0">
              <div className="flex flex-wrap gap-4 text-sm">
                {formData.consultingDoctor && (
                  <div className='flex-1 min-w-[120px]'>
                    <div className="text-xs text-gray-500">Consulting Doctor</div>
                    <div className="font-medium text-gray-900">{formData.consultingDoctor}</div>
                  </div>
                )}
                {formData.caseHandleBy && (
                  <div className='flex-1 min-w-[120px]'>
                    <div className="text-xs text-gray-500">Case Handled By</div>
                    <div className="font-medium text-gray-900">{formData.caseHandleBy}</div>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                {(formData.firstName || formData.patientFirstName) && (
                  <div className='flex-1 min-w-[120px]'>
                    <div className="text-xs text-gray-500">Patient Name</div>
                    <div className="font-medium text-gray-900">{formData.firstName || formData.patientFirstName} {formData.lastName || formData.patientLastName}</div>
                  </div>
                )}
                {(formData.age || formData.patientAge) && (
                  <div className='flex-1 min-w-[120px]'>
                    <div className="text-xs text-gray-500">Age</div>
                    <div className="font-medium text-gray-900">{formData.age || formData.patientAge}</div>
                  </div>
                )}
                {(formData.sex || formData.patientSex) && (
                  <div className='flex-1 min-w-[120px]'>
                    <div className="text-xs text-gray-500">Gender</div>
                    <div className="font-medium text-gray-900">{formData.sex || formData.patientSex}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          {/* Restoration & Treatment Details */}
          <Card className="shadow-sm p-3">
            <CardHeader className="pb-3 print:pb-2 mb-4 p-0">
              <div className="flex items-center justify-between">
                <div className='flex items-center gap-2'>
                  <div className="p-2 border bg-[#0B804326] text-[#0B8043] h-[32px] w-[32px] rounded-[6px]">
                    <ArchiveRestore className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-gray-900">Restoration & Treatment Details</CardTitle>
                </div>
                <EditButton onClick={() => onEditSection?.(3)} label="Edit" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4 print:space-y-3 p-0">
              {/* Type of Restoration */}
              <div>
                <div className="text-xs text-gray-500 mb-2">Type of Restoration</div>
                <div className='flex items-center gap-2'>
                  <div className="w-7 h-7 bg-teal-500 rounded-[6px] flex items-center justify-center flex-shrink-0">
                    {formData.category === "implant" ? (
                      <img src={ImpantTeeth} alt="ImplantTeeth" />
                    ) : (
                      <img src={CrownBridgeTeeth} alt="CrownBridgeTeeth" />
                    )}
                  </div>
                  <div className='font-medium text-gray-900'>{typeLabel}</div>
                </div>
              </div>

              {/* Configured Groups Detail Cards - Show all configured groups */}
              {Object.entries(groupedByType).map(([type, groups]) => {
                const groupsArray = groups as any[];
                return (
                  <Card key={type} className="border border-green-200 bg-gray-50 mb-4">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium capitalize">
                            {type}
                          </span>
                        </div>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>

                      {/* Teeth Information */}
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <p className="font-medium text-gray-900 mb-1">Teeth:</p>
                          <div className="text-gray-600">
                            {["bridge", "joint", "individual"].map((groupType) => {
                              const groupsOfType = groupsArray.filter((g: any) => g.groupType === groupType);
                              if (groupsOfType.length === 0) return null;
                              const teethNumbers = groupsOfType
                                .flatMap((g: any) => g.teethDetails?.flat() || [])
                                .map((t: any) => t.toothNumber ?? t.teethNumber)
                                .filter((n: any) => n !== undefined && n !== null && n !== "")
                                .join(", ");
                              return teethNumbers ? (
                                <div key={groupType} className="flex items-center gap-2 mb-1">
                                  <div className={`w-2 h-2 rounded-full ${groupType === 'individual' ? 'bg-[#1D4ED8]' : groupType === 'joint' ? 'bg-[#0B8043]' : 'bg-[#EA580C]'}`}></div>
                                  <span className="font-semibold capitalize text-xs">{groupType}:</span>
                                  <span className="text-xs">{teethNumbers}</span>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>

                        {/* Products Information */}
                        <div>
                          <p className="font-medium text-gray-900 mb-1">Products:</p>
                          <div className="text-gray-600 space-y-1">
                            {(() => {
                              const toothProductList: { tooth: number; products: string[] }[] = [];
                              groupsArray.forEach((group: any) => {
                                group.teethDetails?.flat().forEach((tooth: any) => {
                                  let productNames: string[] = [];
                                  if (tooth.selectedProducts && Array.isArray(tooth.selectedProducts) && tooth.selectedProducts.length > 0) {
                                    productNames = tooth.selectedProducts.map((p: any) => p.name);
                                  } else if (tooth.productName && Array.isArray(tooth.productName)) {
                                    productNames = [...tooth.productName];
                                  } else if (tooth.productDetails && tooth.productDetails.productName && tooth.productDetails.productName.length > 0) {
                                    productNames = [...tooth.productDetails.productName];
                                  }
                                  if (productNames.length > 0) {
                                    toothProductList.push({
                                      tooth: tooth.teethNumber || tooth.toothNumber,
                                      products: productNames,
                                    });
                                  }
                                });
                              });
                              toothProductList.sort((a, b) => a.tooth - b.tooth);
                              return toothProductList.map((item, i) => (
                                <div key={i} className="text-xs">
                                  <span className="font-semibold">Tooth {item.tooth}:</span> {item.products.join(", ")}
                                </div>
                              ));
                            })()}
                          </div>
                        </div>
                      </div>

                      {/* Implant Details for implant type */}
                      {type === "implant" && (() => {
                        const implantTeeth = groupsArray.flatMap((g: any) => g.teethDetails?.flat() || [])
                          .filter((tooth: any) => tooth.implantDetails);

                        if (implantTeeth.length > 0) {
                          return (
                            <div className="mt-3">
                              <p className="font-medium text-gray-900 mb-2">Implant Details:</p>
                              <div className="space-y-2">
                                {implantTeeth.map((tooth: any, idx: number) => (
                                  <div key={idx} className="border rounded-md p-2 bg-gray-50">
                                    <div className="font-semibold text-sm text-gray-800 mb-1">
                                      Tooth {tooth.toothNumber || tooth.teethNumber}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      {tooth.implantDetails?.companyName && (
                                        <div>
                                          <span className="font-semibold text-gray-700">Company:</span>
                                          <span className="ml-1 text-gray-600">{tooth.implantDetails.companyName}</span>
                                        </div>
                                      )}
                                      {tooth.implantDetails?.systemName && (
                                        <div>
                                          <span className="font-semibold text-gray-700">System:</span>
                                          <span className="ml-1 text-gray-600">{tooth.implantDetails.systemName}</span>
                                        </div>
                                      )}
                                      {tooth.implantDetails?.remarks && (
                                        <div className="col-span-2">
                                          <span className="font-semibold text-gray-700">Remarks:</span>
                                          <span className="ml-1 text-gray-600">{tooth.implantDetails.remarks}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      {/* Shade and Treatment Details */}
                      <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                        <div>
                          <p className="font-medium text-gray-900 mb-1">Shade:</p>
                          <p className="text-gray-600">
                            {(() => {
                              // Check for shade in tooth productDetails first
                              const toothWithShade = groupsArray
                                .flatMap(
                                  (g: any) => g.teethDetails?.flat() || [],
                                )
                                .find(
                                  (tooth: any) => tooth.productDetails?.shade,
                                );

                              if (toothWithShade?.productDetails?.shade) {
                                return toothWithShade.productDetails.shade;
                              }

                              // Fallback to group level
                              const shadeDetails = groupsArray.find(
                                (g: any) => g.shadeDetails,
                              )?.shadeDetails;
                              return shadeDetails || "Not specified";
                            })()}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 mb-1">Occlusal Staining:</p>
                          <p className="text-gray-600 capitalize">
                            {(() => {
                              // Check for occlusal staining in tooth productDetails first
                              const toothWithStaining = groupsArray
                                .flatMap(
                                  (g: any) => g.teethDetails?.flat() || [],
                                )
                                .find(
                                  (tooth: any) =>
                                    tooth.productDetails?.occlusalStaining,
                                );

                              if (
                                toothWithStaining?.productDetails
                                  ?.occlusalStaining
                              ) {
                                return toothWithStaining.productDetails
                                  .occlusalStaining;
                              }

                              // Fallback to group level or selectedTeeth level
                              const groupStaining = groupsArray.find(
                                (g: any) => g.occlusalStaining,
                              )?.occlusalStaining;

                              if (groupStaining) return groupStaining;

                              // Check in selectedTeeth for individual teeth
                              const selectedToothStaining = (
                                formData.selectedTeeth || []
                              ).find(
                                (tooth: any) => tooth.occlusalStaining,
                              )?.occlusalStaining;

                              return selectedToothStaining || "Not specified";
                            })()}
                          </p>
                        </div>
                      </div>

                      {/* Shade Guide */}
                      {(() => {
                        // Check for shade guide in tooth productDetails first
                        const toothWithShadeGuide = groupsArray
                          .flatMap((g: any) => g.teethDetails?.flat() || [])
                          .find(
                            (tooth: any) =>
                              tooth.productDetails?.shadeGuide &&
                              tooth.productDetails.shadeGuide.type &&
                              tooth.productDetails.shadeGuide.shades &&
                              tooth.productDetails.shadeGuide.shades.length > 0,
                          );

                        let shadeGuide =
                          toothWithShadeGuide?.productDetails?.shadeGuide;

                        if (!shadeGuide) {
                          // Fallback to group level
                          shadeGuide = groupsArray.find(
                            (g: any) =>
                              g.shadeGuide &&
                              g.shadeGuide.type &&
                              g.shadeGuide.shades &&
                              g.shadeGuide.shades.length > 0,
                          )?.shadeGuide;
                        }

                        if (!shadeGuide) {
                          // Check in selectedTeeth for individual teeth
                          const selectedToothWithGuide = (
                            formData.selectedTeeth || []
                          ).find(
                            (tooth: any) =>
                              tooth.shadeGuide &&
                              tooth.shadeGuide.type &&
                              tooth.shadeGuide.shades &&
                              tooth.shadeGuide.shades.length > 0,
                          );
                          shadeGuide = selectedToothWithGuide?.shadeGuide;
                        }

                        if (shadeGuide) {
                          return (
                            <div className="mt-3">
                              <p className="font-medium text-gray-900 mb-1">Shade Guide:</p>
                              <div className="text-gray-600 capitalize">
                                <span className="font-semibold">
                                  {shadeGuide.type === "anterior" ? "Anterior" : "Posterior"}:
                                </span>
                                <div className="mt-1">
                                  {shadeGuide.shades.map((shade: string, idx: number) => (
                                    <div key={idx} className="text-xs">{shade}</div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      {/* Trial Requirements */}
                      {(() => {
                        // Check for trial requirements in tooth productDetails first
                        const toothWithTrial = groupsArray
                          .flatMap((g: any) => g.teethDetails?.flat() || [])
                          .find((tooth: any) => tooth.productDetails?.trial);

                        let trialRequirements =
                          toothWithTrial?.productDetails?.trial;

                        if (!trialRequirements) {
                          // Fallback to group level
                          trialRequirements = groupsArray.find(
                            (g: any) => g.trialRequirements,
                          )?.trialRequirements;
                        }

                        if (!trialRequirements) {
                          // Check in selectedTeeth for individual teeth
                          const selectedToothTrial = (
                            formData.selectedTeeth || []
                          ).find(
                            (tooth: any) => tooth.trialRequirements,
                          )?.trialRequirements;
                          trialRequirements = selectedToothTrial;
                        }

                        if (trialRequirements) {
                          return (
                            <div className="mt-3">
                              <p className="font-medium text-gray-900 mb-1">Trial Requirements:</p>
                              <p className="text-gray-600 capitalize text-sm">
                                {trialRequirements}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      {/* Shade Notes */}
                      {(() => {
                        // Check for shade notes in tooth productDetails first
                        const toothWithShadeNotes = groupsArray
                          .flatMap((g: any) => g.teethDetails?.flat() || [])
                          .find(
                            (tooth: any) => tooth.productDetails?.shadeNotes,
                          );

                        let shadeNotes =
                          toothWithShadeNotes?.productDetails?.shadeNotes;

                        if (!shadeNotes) {
                          // Fallback to group level
                          shadeNotes = groupsArray.find(
                            (g: any) => g.shadeNotes,
                          )?.shadeNotes;
                        }

                        if (!shadeNotes) {
                          // Check in selectedTeeth for individual teeth
                          const selectedToothShadeNotes = (
                            formData.selectedTeeth || []
                          ).find((tooth: any) => tooth.shadeNotes)?.shadeNotes;
                          shadeNotes = selectedToothShadeNotes;
                        }

                        if (shadeNotes) {
                          return (
                            <div className="mt-3">
                              <p className="font-medium text-gray-900 mb-1">Shade Notes:</p>
                              <p className="text-gray-600 text-sm italic">
                                {shadeNotes}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      {/* Pontic Design */}
                      {(() => {
                        const ponticDesign = groupsArray.find((g: any) => g.ponticDesign)?.ponticDesign;
                        if (ponticDesign) {
                          return (
                            <div className="mt-3">
                              <p className="font-medium text-gray-900 mb-1">Pontic Design:</p>
                              <div className="text-gray-600 text-sm">
                                {ponticDesign}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      {/* Additional Notes */}
                      {(() => {
                        const notes = groupsArray.flatMap((g: any) =>
                          g.teethDetails?.flat()
                            .map((t: any) => t.productDetails?.notes)
                            .filter(Boolean)
                        );
                        if (notes.length > 0) {
                          return (
                            <div className="mt-3">
                              <p className="font-medium text-gray-900 mb-1">Notes:</p>
                              <p className="text-gray-600 italic text-xs leading-relaxed">
                                {notes.join(" | ")}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
          {/* File Upload Summary */}
          <Card className="shadow-sm p-3">
            <CardHeader className=" print:pb-2 p-0 pb-3">
              <div className="flex items-center justify-between">
                <div className='flex items-center gap-2'>
                  <div className="p-2 border bg-[#A1620726] text-[#A16207] border-[#A16207] h-[32px] w-[32px] rounded-[6px]">
                    <FileText className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-gray-900">File Upload Summary</CardTitle>
                </div>
                <div className='h-8 w-8 text-center border border-[#DEDDDD] rounded-sm flex items-center justify-center'>
                  <Edit2 size={12} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2 print:space-y-1 p-0">
              {/* Helper function to get all files from different sources */}
              {(() => {
                const allFiles: Array<{ fileName: string, size?: number, type: string }> = [];

                // Add files from different sources with their types
                if (formData.files && Array.isArray(formData.files)) {
                  formData.files.forEach((file: any) => {
                    allFiles.push({
                      fileName: file.fileName || file.name || 'Unknown File',
                      size: file.size,
                      type: 'General Files'
                    });
                  });
                }

                if (formData.referralFiles && Array.isArray(formData.referralFiles)) {
                  formData.referralFiles.forEach((file: any) => {
                    allFiles.push({
                      fileName: file.fileName || file.name || 'Unknown File',
                      size: file.size,
                      type: 'Referral Files'
                    });
                  });
                }

                if (formData.intraOralScans && Array.isArray(formData.intraOralScans)) {
                  formData.intraOralScans.forEach((file: any) => {
                    allFiles.push({
                      fileName: file.fileName || file.name || 'Unknown File',
                      size: file.size,
                      type: 'Intra-Oral Scans'
                    });
                  });
                }

                if (formData.faceScans && Array.isArray(formData.faceScans)) {
                  formData.faceScans.forEach((file: any) => {
                    allFiles.push({
                      fileName: file.fileName || file.name || 'Unknown File',
                      size: file.size,
                      type: 'Face Scans'
                    });
                  });
                }

                if (formData.patientPhotos && Array.isArray(formData.patientPhotos)) {
                  formData.patientPhotos.forEach((file: any) => {
                    allFiles.push({
                      fileName: file.fileName || file.name || 'Unknown File',
                      size: file.size,
                      type: 'Patient Photos'
                    });
                  });
                }

                if (allFiles.length > 0) {
                  return (
                    <div className="space-y-2">
                      {allFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-900">{file.type}</span>
                            <span className="text-gray-500 truncate max-w-[160px] block">{file.fileName}</span>
                          </div>
                          <span className="text-gray-600">
                            {file.size ? `${(file.size / (1024 * 1024)).toFixed(2)} Mb` : 'Size unknown'}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                } else {
                  return <div className="text-sm text-gray-500 italic">No files uploaded</div>;
                }
              })()}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Confirmation/Info Box */}
      {/* Additional Notes */}
      {
        userType !== "Qa" &&
        <Card className="shadow-sm mb-3 p-3">
          <CardHeader className="pb-3 print:pb-2 p-0">
            <div className="flex items-center justify-between">
              <div className='flex items-center gap-2'>
                <div className="p-2 border bg-[#1D4ED826] text-[#1D4ED8] h-[32px] w-[32px] rounded-[6px]">
                  <Edit2 className="h-4 w-4" />
                </div>
                <CardTitle className="text-sm font-semibold text-gray-900">Additional Notes</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-sm text-gray-600 p-2 rounded min-h-[40px] mt-4">
              {formData.notes || <span className="italic text-gray-400">No additional notes</span>}
            </div>
          </CardContent>
        </Card>
      }
      {
        userType !== "Qa" &&
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 print:p-3 print:bg-transparent print:border-gray-300">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 print:h-4 print:w-4" />
            <div>
              <p className="text-emerald-800 font-medium text-sm print:text-xs">
                Please review all details carefully before submitting your {orderCategory} request.
              </p>
              <p className="text-emerald-700 text-xs mt-1 print:hidden">
                Once submitted, the lab will begin processing your order according to the specified requirements.
              </p>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default OrderSummary;