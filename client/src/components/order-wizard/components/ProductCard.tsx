import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormField from "@/components/shared/FormField";
import TrialSelector from "./TrialSelector";
import ShadeGuideSection from "./ShadeGuideSection";
import ShadeSelector, { shadeOptions } from "../ShadeSelector";
import BaseModal from "@/components/shared/BaseModal";
import { useToast } from "@/hooks/use-toast";
import ProductSearch from "../ProductSearch";
import { SelectedProduct } from "@/qaScreen/data/cases";
import PonticSelector from "./PonticSelector";

interface ProductCardProps {
  type: string;
  formData: any;
  allGroups: any;
  groups: any;
  groupIdx: number;
  onSaveGroupFields: (groupIdx: number, field: string, value: any) => void;
  setFormData: any;
  readMode?: boolean;
}

const upperArchTeeth = [
  11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28,
];
const lowerArchTeeth = [
  31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48,
];

const archBasedPrescriptionTypes = [
  "splints-guards",
  "ortho",
  "dentures",
  "sleep-accessories",
];

const ProductCard: React.FC<ProductCardProps> = ({
  type,
  formData,
  allGroups,
  groups,
  groupIdx,
  onSaveGroupFields,
  setFormData,
  readMode = false,
}) => {
  const { toast } = useToast();
  const group = groups[0];
  // Local state for modal/editing
  const [editField, setEditField] = useState<null | {
    field: string;
    groupIdx: number;
  }>(null);
  const [editFieldValue, setEditFieldValue] = useState<any>("");
  const [showProductCheckboxes, setShowProductCheckboxes] = useState<
    Record<string, boolean>
  >({});
  const [selectedTeethForProducts, setSelectedTeethForProducts] = useState<
    number[]
  >([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [modalSelectedProducts, setModalSelectedProducts] = useState<
    SelectedProduct[]
  >([]);

  // Helper for group teeth
  const allTeethInGroup = group.teethDetails?.flat() || [];
  // Save handler for modal
  const handleSaveField = () => {
    if (editField) {
      onSaveGroupFields(editField.groupIdx, editField.field, editFieldValue);
      setEditField(null);
    }
  };

  const openProductModal = () => {
    setModalSelectedProducts([]);
    setIsProductModalOpen(true);
  };

  const handleSaveProductsToTeeth = () => {
    // Update selected products for selectedTeethForProducts in the group
    let updatedGroups = [...allGroups];
    updatedGroups = updatedGroups.map((group: any) => {
      const updatedTeethDetails = group.teethDetails.map((arr: any) =>
        arr.map((tooth: any) => {
          const toothNumber = tooth.toothNumber || tooth.teethNumber;
          if (selectedTeethForProducts.includes(toothNumber)) {
            // Add new products to existing products
            const existingProducts = tooth.selectedProducts || [];
            const newProducts = modalSelectedProducts.filter(
              (newProd: any) =>
                !existingProducts.some(
                  (existing: any) => existing.id === newProd.id
                )
            );
            return {
              ...tooth,
              selectedProducts: [...existingProducts, ...newProducts],
              productName: [
                ...(tooth.productName || []),
                ...newProducts.map((p: any) => p.name),
              ],
              productDetails: {
                ...tooth.productDetails,
                productName: [
                  ...(tooth.productDetails?.productName || []),
                  ...newProducts.map((p: any) => p.name),
                ],
              },
            };
          }
          return tooth;
        })
      );
      return {
        ...group,
        teethDetails: updatedTeethDetails,
      };
    });
    // console.log("updatedGroups", updatedGroups)
    setFormData({
      ...formData,
      teethGroup: updatedGroups,
    });
    setIsProductModalOpen(false);
    setSelectedTeethForProducts([]);
  };

  return (
    <Card className="border border-green-200 bg-gray-50 mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 ${
                group.prescriptionType === "implant"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-orange-100 text-orange-800"
              } text-xs rounded-full font-medium`}
            >
              {(() => {
                switch (group.prescriptionType) {
                  case "implant":
                    return "Implant Solution";
                  case "fixed-restoration":
                    return "Fixed Restoration";
                  case "splints-guards":
                    return "Splints, Guards & TMJ";
                  case "ortho":
                    return "Ortho";
                  case "dentures":
                    return "Dentures";
                  case "sleep-accessories":
                    return "Sleep Accessories";
                  default:
                    return "Crown & Bridge";
                }
              })()}
            </span>
          </div>
          <div className="flex gap-2">
            {!readMode && (
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-blue-600"
                onClick={() => {
                  setShowProductCheckboxes((prev: any) => ({
                    ...prev,
                    [type]: !prev[type],
                  }));
                }}
                aria-label="Add product selection"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              className="p-1 text-gray-400 hover:text-green-600"
              aria-label="Group already configured"
              onClick={() => {
                toast({
                  title: "Group already configured",
                  description:
                    "This group has already been configured. You can edit it using the pencil icon.",
                });
              }}
              disabled
            >
              <CheckCircle className="w-4 h-4 text-green-600" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-900 mb-1">Teeth:</p>
            <div className="text-gray-600">
              {(() => {
                // Arch-based types
                const archBasedTypes = [
                  "splints-guards",
                  "ortho",
                  "dentures",
                  "sleep-accessories",
                ];
                const isArchBased = archBasedTypes.includes(
                  group.prescriptionType
                );

                // Prefer teethDetails, but fall back to selectedTeeth if empty
                const allTeeth = groups
                  .flatMap((g: any) => g.teethDetails?.flat() || [])
                  .map((t: any) => t.toothNumber ?? t.teethNumber);

                if (isArchBased) {
                  const hasUpper = allTeeth.some((t: any) =>
                    upperArchTeeth.includes(t.toothNumber ?? t.teethNumber)
                  );
                  const hasLower = allTeeth.some((t: any) =>
                    lowerArchTeeth.includes(t.toothNumber ?? t.teethNumber)
                  );
                  return (
                    <>
                      {hasUpper && (
                        <div>
                          <span className="font-semibold">Upper Arch</span>
                        </div>
                      )}
                      {hasLower && (
                        <div>
                          <span className="font-semibold">Lower Arch</span>
                        </div>
                      )}
                    </>
                  );
                } else {
                  // For fixed-restoration and implant, show individual teeth
                  return ["bridge", "joint", "individual"].map((groupType) => {
                    const groupsOfType = groups.filter(
                      (g: any) => g.groupType === groupType
                    );
                    if (groupsOfType.length === 0) return null;
                    const teethNumbers = groupsOfType
                      .flatMap((g: any) => g.teethDetails?.flat() || [])
                      .map((t: any) => t.toothNumber ?? t.teethNumber)
                      .filter(
                        (n: any) => n !== undefined && n !== null && n !== ""
                      )
                      .join(", ");
                    return teethNumbers ? (
                      <div key={groupType}>
                        <span className="font-semibold capitalize">
                          {groupType}:
                        </span>{" "}
                        {teethNumbers}
                      </div>
                    ) : null;
                  });
                }
              })()}
            </div>

            {/* Implant details if needed */}
            {type === "implant" && (
              <div className="mt-3">
                <p className="font-medium text-gray-900 mb-2">
                  Implant Details:
                </p>
                {(() => {
                  // Get all teeth with implant details from bridge/joint groups
                  const groupTeethWithImplantDetails = groups
                    .flatMap((g: any) => {
                      // Check if group has teethDetails structure (bridge/joint)
                      if (g.teethDetails && Array.isArray(g.teethDetails)) {
                        return g.teethDetails.flat();
                      }
                      return [];
                    })
                    .filter((tooth: any) => {
                      // Check if tooth has implant details
                      return (
                        tooth &&
                        tooth.implantDetails &&
                        typeof tooth.implantDetails === "object" &&
                        Object.keys(tooth.implantDetails).length > 0 &&
                        (tooth.implantDetails.companyName ||
                          tooth.implantDetails.systemName ||
                          tooth.implantDetails.remarks)
                      );
                    });

                  // Also check individual teeth with implant prescription type
                  const individualTeethWithImplantDetails = (
                    formData.selectedTeeth || []
                  ).filter(
                    (tooth: any) =>
                      tooth.prescriptionType === "implant" &&
                      tooth.implantDetails &&
                      typeof tooth.implantDetails === "object" &&
                      Object.keys(tooth.implantDetails).length > 0 &&
                      (tooth.implantDetails.companyName ||
                        tooth.implantDetails.systemName ||
                        tooth.implantDetails.remarks)
                  );

                  // Create a map to avoid duplicates by tooth number
                  const teethMap = new Map();

                  // Add group teeth first (bridge/joint implant teeth)
                  groupTeethWithImplantDetails.forEach((tooth: any) => {
                    const toothNumber = tooth.toothNumber || tooth.teethNumber;
                    if (toothNumber && !teethMap.has(toothNumber)) {
                      teethMap.set(toothNumber, tooth);
                    }
                  });

                  // Add individual teeth only if not already in map
                  individualTeethWithImplantDetails.forEach((tooth: any) => {
                    const toothNumber = tooth.toothNumber || tooth.teethNumber;
                    if (toothNumber && !teethMap.has(toothNumber)) {
                      teethMap.set(toothNumber, tooth);
                    }
                  });

                  // Convert map to array and sort by tooth number
                  const allImplantTeeth = Array.from(teethMap.values()).sort(
                    (a: any, b: any) => {
                      const aNum = a.toothNumber || a.teethNumber;
                      const bNum = b.toothNumber || b.teethNumber;
                      return aNum - bNum;
                    }
                  );

                  if (allImplantTeeth.length === 0) {
                    return (
                      <div className="text-sm text-gray-500 italic">
                        No implant details available
                      </div>
                    );
                  }

                  // Use Accordion UI for each tooth (like previous section)
                  return (
                    <Accordion type="multiple" className="w-full ">
                      {allImplantTeeth.map((tooth: any, idx: number) => (
                        <AccordionItem
                          key={idx}
                          value={`tooth-${
                            tooth.toothNumber || tooth.teethNumber
                          }`}
                          className="border-none mb-2"
                        >
                          <AccordionTrigger className="p-0 text-sm font-normal border border-gray-400 px-2 py-1 rounded-sm">
                            Tooth {tooth.toothNumber || tooth.teethNumber}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="border rounded-md p-2 bg-gray-50 mb-2 flex flex-col gap-2">
                              {tooth.implantDetails?.companyName && (
                                <div className="flex gap-2 items-baseline">
                                  <span className="font-semibold text-sm text-gray-800 min-w-[80px]">
                                    Company:
                                  </span>
                                  <span className="text-gray-700 text-sm">
                                    {tooth.implantDetails.companyName}
                                  </span>
                                </div>
                              )}
                              {tooth.implantDetails?.systemName && (
                                <div className="flex gap-2 items-baseline">
                                  <span className="font-semibold text-sm text-gray-800 min-w-[80px]">
                                    System:
                                  </span>
                                  <span className="text-gray-700 text-sm">
                                    {tooth.implantDetails.systemName}
                                  </span>
                                </div>
                              )}
                              {tooth.implantDetails?.remarks && (
                                <div className="flex gap-2 items-baseline">
                                  <span className="font-semibold text-sm text-gray-800 min-w-[80px]">
                                    Remarks:
                                  </span>
                                  <span className="text-gray-700 text-sm">
                                    {tooth.implantDetails.remarks}
                                  </span>
                                </div>
                              )}
                              {tooth.implantDetails?.photo && (
                                <div className="flex flex-col gap-1">
                                  <span className="font-semibold text-sm text-gray-800">
                                    Photo:
                                  </span>
                                  <img
                                    src={tooth.implantDetails.photo}
                                    alt="Implant Photo"
                                    className="w-28 h-28 object-cover rounded border border-gray-300 bg-white"
                                  />
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  );
                })()}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {/* Only show select-all checkbox if toggled on */}
                {showProductCheckboxes?.[group.prescriptionType] &&
                  (() => {
                    const allTeethFromType =
                      group.teethDetails
                        ?.flat()
                        .map((t: any) => t.teethNumber || t.toothNumber) || [];
                    if (allTeethFromType.length > 1) {
                      return (
                        <input
                          type="checkbox"
                          className="w-3 h-3 rounded border-gray-300"
                          checked={
                            selectedTeethForProducts.length ===
                              allTeethFromType.length &&
                            allTeethFromType.every((tooth: any) =>
                              selectedTeethForProducts.includes(tooth)
                            )
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTeethForProducts(allTeethFromType);
                            } else {
                              setSelectedTeethForProducts([]);
                            }
                          }}
                        />
                      );
                    }
                    return null;
                  })()}
                <p className="font-medium text-gray-900 mb-0">Products:</p>
              </div>
            </div>
            {/* Product display logic for arch-based vs individual teeth */}
            <div className="text-gray-600 space-y-1 mt-2">
              {(() => {
                const isArchBased = archBasedPrescriptionTypes.includes(
                  type || group.prescriptionType || ""
                );

                if (isArchBased) {
                  const allTeethWithProducts = groups.flatMap(
                    (g: any) => g.teethDetails?.flat() || []
                  );

                  const upperArchProducts = new Set<string>();
                  const lowerArchProducts = new Set<string>();

                  allTeethWithProducts.forEach((tooth: any) => {
                    const toothNum = tooth.toothNumber || tooth.teethNumber;
                    let productNames: string[] = [];

                    if (
                      tooth.selectedProducts &&
                      tooth.selectedProducts.length > 0
                    ) {
                      productNames = tooth.selectedProducts.map(
                        (p: any) => p.name
                      );
                    } else if (
                      tooth.productName &&
                      tooth.productName.length > 0
                    ) {
                      productNames = [...tooth.productName];
                    } else if (
                      tooth.productDetails?.productName &&
                      tooth.productDetails.productName.length > 0
                    ) {
                      productNames = [...tooth.productDetails.productName];
                    }

                    if (upperArchTeeth.includes(toothNum)) {
                      productNames.forEach((name) =>
                        upperArchProducts.add(name)
                      );
                    } else if (lowerArchTeeth.includes(toothNum)) {
                      productNames.forEach((name) =>
                        lowerArchProducts.add(name)
                      );
                    }
                  });

                  return (
                    <>
                      {upperArchProducts.size > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          {showProductCheckboxes?.[group.prescriptionType] && (
                            <input
                              type="checkbox"
                              className="w-3 h-3 rounded border-gray-300"
                              checked={allTeethInGroup
                                .filter((t: any) =>
                                  upperArchTeeth.includes(
                                    t.toothNumber || t.teethNumber
                                  )
                                )
                                .every((t: any) =>
                                  selectedTeethForProducts.includes(
                                    t.toothNumber || t.teethNumber
                                  )
                                )}
                              onChange={(e) => {
                                const upperTeeth = allTeethInGroup
                                  .filter((t: any) =>
                                    upperArchTeeth.includes(
                                      t.toothNumber || t.teethNumber
                                    )
                                  )
                                  .map(
                                    (t: any) => t.toothNumber || t.teethNumber
                                  );

                                if (e.target.checked) {
                                  setSelectedTeethForProducts(
                                    Array.from(
                                      new Set([
                                        ...selectedTeethForProducts,
                                        ...upperTeeth,
                                      ])
                                    )
                                  );
                                } else {
                                  setSelectedTeethForProducts(
                                    selectedTeethForProducts.filter(
                                      (t: number) => !upperTeeth.includes(t)
                                    )
                                  );
                                }
                              }}
                            />
                          )}
                          <span>
                            Upper Arch:{" "}
                            {Array.from(upperArchProducts).join(", ")}
                          </span>
                        </div>
                      )}
                      {lowerArchProducts.size > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          {showProductCheckboxes?.[group.prescriptionType] && (
                            <input
                              type="checkbox"
                              className="w-3 h-3 rounded border-gray-300"
                              checked={allTeethInGroup
                                .filter((t: any) =>
                                  lowerArchTeeth.includes(
                                    t.toothNumber || t.teethNumber
                                  )
                                )
                                .every((t: any) =>
                                  selectedTeethForProducts.includes(
                                    t.toothNumber || t.teethNumber
                                  )
                                )}
                              onChange={(e) => {
                                const lowerTeeth = allTeethInGroup
                                  .filter((t: any) =>
                                    lowerArchTeeth.includes(
                                      t.toothNumber || t.teethNumber
                                    )
                                  )
                                  .map(
                                    (t: any) => t.toothNumber || t.teethNumber
                                  );

                                if (e.target.checked) {
                                  setSelectedTeethForProducts(
                                    Array.from(
                                      new Set([
                                        ...selectedTeethForProducts,
                                        ...lowerTeeth,
                                      ])
                                    )
                                  );
                                } else {
                                  setSelectedTeethForProducts(
                                    selectedTeethForProducts.filter(
                                      (t: number) => !lowerTeeth.includes(t)
                                    )
                                  );
                                }
                              }}
                            />
                          )}
                          <span>
                            Lower Arch:{" "}
                            {Array.from(lowerArchProducts).join(", ")}
                          </span>
                        </div>
                      )}
                    </>
                  );
                } else {
                  // For fixed-restoration and implant, show individual teeth products
                  const toothProductList: {
                    tooth: number;
                    products: string[];
                    shadeGuide?: string[];
                    shadeNotes?: string;
                    trialRequirements?: string;
                    occlusalStaining?: string;
                  }[] = [];
                  group.teethDetails?.flat().forEach((tooth: any) => {
                    let productNames: string[] = [];
                    if (
                      tooth.selectedProducts &&
                      tooth.selectedProducts.length > 0
                    ) {
                      productNames = tooth.selectedProducts.map(
                        (p: any) => p.name
                      );
                    } else if (
                      tooth.productName &&
                      tooth.productName.length > 0
                    ) {
                      productNames = [...tooth.productName];
                    } else if (
                      tooth.productDetails &&
                      tooth.productDetails.productName &&
                      tooth.productDetails.productName.length > 0
                    ) {
                      productNames = [...tooth.productDetails.productName];
                    }
                    if (productNames.length > 0) {
                      toothProductList.push({
                        tooth: tooth.teethNumber || tooth.toothNumber,
                        products: productNames,
                        shadeGuide: tooth.shadeGuide,
                        shadeNotes: tooth.shadeNotes,
                        trialRequirements: tooth.trialRequirements,
                        occlusalStaining: tooth.occlusalStaining,
                      });
                    }
                  });
                  toothProductList.sort((a, b) => a.tooth - b.tooth);
                  return toothProductList.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      {showProductCheckboxes?.[group.prescriptionType] && (
                        <input
                          type="checkbox"
                          className="w-3 h-3 rounded border-gray-300"
                          checked={selectedTeethForProducts.includes(
                            item.tooth
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTeethForProducts([
                                ...selectedTeethForProducts,
                                item.tooth,
                              ]);
                            } else {
                              setSelectedTeethForProducts(
                                selectedTeethForProducts.filter(
                                  (t: number) => t !== item.tooth
                                )
                              );
                            }
                          }}
                        />
                      )}
                      <span>
                        Tooth {item.tooth}: {item.products.join(", ")}
                      </span>
                    </div>
                  ));
                }
              })()}
            </div>
            {selectedTeethForProducts.length > 0 && (
              <div className="mt-3 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={openProductModal}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {(() => {
                    const isArchBased = archBasedPrescriptionTypes.includes(
                      group.prescriptionType || ""
                    );

                    if (isArchBased) {
                      const hasUpperSelected = selectedTeethForProducts.some(
                        (tooth) => upperArchTeeth.includes(tooth)
                      );
                      const hasLowerSelected = selectedTeethForProducts.some(
                        (tooth) => lowerArchTeeth.includes(tooth)
                      );

                      if (hasUpperSelected && hasLowerSelected) {
                        return "Add product for both arches";
                      } else if (hasUpperSelected) {
                        return "Add product for upper arch";
                      } else if (hasLowerSelected) {
                        return "Add product for lower arch";
                      } else {
                        return "Add product for selected arch";
                      }
                    } else {
                      return `Add product for ${
                        selectedTeethForProducts.length
                      } selected ${
                        selectedTeethForProducts.length === 1
                          ? "tooth"
                          : "teeth"
                      }`;
                    }
                  })()}
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Shade and Treatment Details */}
        <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
          <div>
            <p className="font-medium text-gray-900 mb-1 flex items-center">
              Shade:
              {!readMode && (
                <button
                  type="button"
                  className="ml-2 p-1 text-gray-400 hover:text-blue-600"
                  onClick={() => {
                    setEditField({
                      field: "shadeDetails",
                      groupIdx: groupIdx,
                    });
                    setEditFieldValue(group?.shadeDetails || "");
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </p>
            <div className="mb-3">
              <div className="text-xs text-gray-500 font-medium mb-0.5">Shade</div>
              <div className="text-base font-semibold">
                {(() => {
                  let shadeDetails = group?.shadeDetails;
                  if (!shadeDetails) {
                    const firstTooth = group.teethDetails?.flat()[0];
                    shadeDetails = firstTooth?.productDetails?.shade || firstTooth?.shadeDetails;
                  }
                  if (shadeDetails) {
                    return <span className="text-black">{shadeDetails}</span>;
                  }
                  if (!readMode) {
                    return (
                      <span
                        className="text-blue-600 cursor-pointer"
                        onClick={() => {
                          setEditField({ field: "shadeDetails", groupIdx: groupIdx });
                          setEditFieldValue("");
                        }}
                      >
                        Add Shade
                      </span>
                    );
                  }
                  return <span className="text-gray-400">-</span>;
                })()}
              </div>
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-1 flex items-center">
              {" "}
              Occlusal Staining:
              {!readMode && (
                <button
                  type="button"
                  className="ml-2 p-1 text-gray-400 hover:text-blue-600"
                  onClick={() => {
                    setEditField({
                      field: "occlusalStaining",
                      groupIdx: groupIdx,
                    });
                    setEditFieldValue(group?.occlusalStaining || "");
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </p>
            <div className="mb-3">
              <div className="text-xs text-gray-500 font-medium mb-0.5">Occlusal Staining</div>
              <div className="text-base font-semibold">
                {(() => {
                  let occlusalStaining = group?.occlusalStaining;
                  if (!occlusalStaining) {
                    const firstTooth = group.teethDetails?.flat()[0];
                    occlusalStaining = firstTooth?.productDetails?.occlusalStaining || firstTooth?.occlusalStaining;
                  }
                  return occlusalStaining ? (
                    <span className="text-black">{occlusalStaining}</span>
                  ) : (
                    <span
                      className="text-blue-600 cursor-pointer"
                      onClick={() => {
                        setEditField({
                          field: "occlusalStaining",
                          groupIdx: groupIdx,
                        });
                        setEditFieldValue("");
                      }}
                    >
                      Add Occlusal Staining
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
        {/* Notes: show all notes concatenated if present */}
        {(() => {
          const notes = group.teethDetails
            ?.flat()
            .map((t: any) => t.productDetails?.notes)
            .filter(Boolean);
          if (notes.length > 0) {
            return (
              <div className="mt-3 text-sm">
                <p className="font-medium text-gray-900 mb-1 flex items-center">
                  {" "}
                  Notes:
                  {!readMode && (
                    <button
                      type="button"
                      className="ml-2 p-1 text-gray-400 hover:text-blue-600"
                      onClick={() => {
                        setEditField({
                          field: "shadeNotes",
                          groupIdx: groupIdx,
                        });
                        setEditFieldValue(group?.shadeNotes || "");
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </p>
                <div className="mb-3">
                  <div className="text-xs text-gray-500 font-medium mb-0.5">Notes</div>
                  <div className="text-base font-semibold">
                    {notes.length > 0 ? (
                      <span className="text-black">{notes.join(" | ")}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })()}
        {/* Notes: show all notes concatenated if present */}
        {(() => {
          const notes = group.teethDetails
            ?.flat()
            .map((t: any) => t.productDetails?.notes)
            .filter(Boolean);
          if (notes.length > 0) {
            return (
              <div className="mt-3 text-sm">
                <p className="font-medium text-gray-900 mb-1 flex items-center">
                  Notes:
                  {!readMode && (
                    <button
                      type="button"
                      className="ml-2 p-1 text-gray-400 hover:text-blue-600"
                      onClick={() => {
                        setEditField({
                          field: "shadeNotes",
                          groupIdx: groupIdx,
                        });
                        setEditFieldValue(group?.shadeNotes || "");
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </p>
                <div className="mb-3">
                  <div className="text-xs text-gray-500 font-medium mb-0.5">Notes</div>
                  <div className="text-base font-semibold">
                    {notes.length > 0 ? (
                      <span className="text-black">{notes.join(" | ")}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })()}

        <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
          <div>
            {(() => {
              // Check group level first, then tooth level
              let shadeGuide = group?.shadeGuide;
              if (
                !shadeGuide ||
                !shadeGuide.type ||
                !shadeGuide.shades ||
                shadeGuide.shades.length === 0
              ) {
                // Check first tooth's shade guide
                const firstTooth = group.teethDetails?.flat()[0];
                shadeGuide = firstTooth?.shadeGuide;
              }

              if (
                shadeGuide &&
                shadeGuide.type &&
                shadeGuide.shades &&
                shadeGuide.shades.length > 0
              ) {
                return (
                  <>
                    <p className="font-medium text-gray-900 mb-1 flex items-center">
                      Shade Guide:
                      {!readMode && (
                        <button
                          type="button"
                          className="ml-2 p-1 text-gray-400 hover:text-blue-600"
                          onClick={() => {
                            setEditField({
                              field: "shadeGuide",
                              groupIdx: groupIdx,
                            });
                            setEditFieldValue(shadeGuide);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                    </p>
                    <div className="text-gray-600 capitalize flex flex-col">
                      <span className="font-semibold">
                        {shadeGuide.type === "anterior"
                          ? "Anterior"
                          : "Posterior"}
                        :
                      </span>
                      <div className="text-gray-600 capitalize flex flex-col">
                        {shadeGuide.shades.map(
                          (shade: string, shadeIdx: number) => (
                            <div key={shadeIdx}>{shade}</div>
                          )
                        )}
                      </div>
                    </div>
                  </>
                );
              } else {
                return (
                  <p className="font-medium text-gray-900 mb-1 flex items-center">
                    Shade Guide:
                    {!readMode && (
                      <button
                        type="button"
                        className="ml-2 p-1 text-gray-400 hover:text-blue-600"
                        onClick={() => {
                          setEditField({
                            field: "shadeGuide",
                            groupIdx: groupIdx,
                          });
                          setEditFieldValue(null);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    {!readMode ? (
                      <span
                        className="text-blue-600 cursor-pointer ml-2"
                        onClick={() => {
                          setEditField({
                            field: "shadeGuide",
                            groupIdx: groupIdx,
                          });
                          setEditFieldValue(null);
                        }}
                      >
                        Add Shade Guide
                      </span>
                    ) : (
                      <span className="text-gray-400 italic text-xs ml-2">
                        No Shade Guide
                      </span>
                    )}
                  </p>
                );
              }
            })()}
          </div>
          <div>
            {(() => {
              // Check group level first, then tooth level
              let trialRequirements = group?.trialRequirements;
              if (!trialRequirements) {
                // Check first tooth's trial requirements
                const firstTooth = group.teethDetails?.flat()[0];
                trialRequirements = firstTooth?.trialRequirements;
              }

              if (trialRequirements) {
                return (
                  <>
                    <p className="font-medium text-gray-900 mb-1 flex items-center">
                      Trial Requirements:
                      {!readMode && (
                        <button
                          type="button"
                          className="ml-2 p-1 text-gray-400 hover:text-blue-600"
                          onClick={() => {
                            setEditField({
                              field: "trialRequirements",
                              groupIdx: groupIdx,
                            });
                            setEditFieldValue(trialRequirements);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                    </p>
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 font-medium mb-0.5">Trial Requirements</div>
                      <div className="text-base font-semibold">
                        {trialRequirements ? (
                          <span className="text-black">{trialRequirements}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </div>
                  </>
                );
              } else {
                return (
                  <p className="font-medium text-gray-900 mb-1 flex items-center">
                    Trial Requirements:
                    {!readMode && (
                      <button
                        type="button"
                        className="ml-2 p-1 text-gray-400 hover:text-blue-600"
                        onClick={() => {
                          setEditField({
                            field: "trialRequirements",
                            groupIdx: groupIdx,
                          });
                          setEditFieldValue("");
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    {!readMode ? (
                      <span
                        className="text-blue-600 cursor-pointer ml-2"
                        onClick={() => {
                          setEditField({
                            field: "trialRequirements",
                            groupIdx: groupIdx,
                          });
                          setEditFieldValue("");
                        }}
                      >
                        Add Trial Requirements
                      </span>
                    ) : (
                      <span className="text-gray-400 italic text-xs ml-2">
                        No Trial Requirements
                      </span>
                    )}
                  </p>
                );
              }
            })()}
          </div>
        </div>
        <div className="mt-3">
          {(() => {
            // Check group level first, then tooth level
            let shadeNotes = group?.shadeNotes;
            if (!shadeNotes) {
              // Check first tooth's shade notes
              const firstTooth = group.teethDetails?.flat()[0];
              shadeNotes = firstTooth?.shadeNotes;
            }

            if (shadeNotes) {
              return (
                <>
                  <p className="font-medium text-gray-900 mb-1 flex items-center">
                    Shade Notes:
                    {!readMode && (
                      <button
                        type="button"
                        className="ml-2 p-1 text-gray-400 hover:text-blue-600"
                        onClick={() => {
                          setEditField({
                            field: "shadeNotes",
                            groupIdx: groupIdx,
                          });
                          setEditFieldValue(shadeNotes);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                  </p>
                  <div className="mb-3">
                    <div className="text-xs text-gray-500 font-medium mb-0.5">Shade Notes</div>
                    <div className="text-base font-semibold">
                      {shadeNotes ? (
                        <span className="text-black">{shadeNotes}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </div>
                </>
              );
            } else {
              return (
                <p className="font-medium text-gray-900 mb-1 flex items-center">
                  Shade Notes:
                  {!readMode && (
                    <button
                      type="button"
                      className="ml-2 p-1 text-gray-400 hover:text-blue-600"
                      onClick={() => {
                        setEditField({
                          field: "shadeNotes",
                          groupIdx: groupIdx,
                        });
                        setEditFieldValue("");
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                  {!readMode ? (
                    <span
                      className="text-blue-600 cursor-pointer ml-2"
                      onClick={() => {
                        setEditField({
                          field: "shadeNotes",
                          groupIdx: groupIdx,
                        });
                        setEditFieldValue("");
                      }}
                    >
                      Add Shade Notes
                    </span>
                  ) : (
                    <span className="text-gray-400 italic text-xs ml-2">
                      No Shade Notes
                    </span>
                  )}
                </p>
              );
            }
          })()}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
          <div>
            <p className="font-medium text-gray-900 mb-1 flex items-center">
              Pontic Design:
              {!readMode && (
                <button
                  type="button"
                  className="ml-2 p-1 text-gray-400 hover:text-blue-600"
                  onClick={() => {
                    setEditField({
                      field: "ponticDesign",
                      groupIdx: groupIdx,
                    });
                    setEditFieldValue(group.ponticDesign || "");
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </p>
            <div className="mt-1">
              <PonticSelector value={group.ponticDesign} readonly />
            </div>
          </div>
        </div>
      </CardContent>
      {/* Modal for editing fields, controlled via local state */}
      <BaseModal
        isOpen={!!editField && editField.groupIdx === groupIdx}
        onClose={() => setEditField(null)}
        title={`Edit ${
          editField?.field
            ? editField.field
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())
            : ""
        }`}
      >
        <div className="flex flex-col h-full justify-between">
          {editField?.field === "shadeDetails" && (
            <ShadeSelector
              value={
                shadeOptions.find(
                  (opt) =>
                    opt.label ===
                    (typeof editFieldValue === "string"
                      ? editFieldValue
                      : editFieldValue[0])
                ) || null
              }
              onValueChange={(value) =>
                setEditFieldValue(value ? value.label : "")
              }
              label="Shade"
              placeholder="Select Shade"
            />
          )}
          {editField?.field === "occlusalStaining" && (
            <FormField
              id="occlusalStaining"
              label="Occlusal Staining"
              type="select"
              value={editFieldValue as string}
              onChange={(value) => setEditFieldValue(value)}
              options={[
                { value: "light", label: "Light" },
                { value: "medium", label: "Medium" },
                { value: "heavy", label: "Heavy" },
              ]}
            />
          )}
          {editField?.field === "shadeGuide" && (
            <ShadeGuideSection
              selectedGroups={[]}
              onShadeGuideChange={(guide) => setEditFieldValue(guide)}
              selectedGuide={editFieldValue}
            />
          )}
          {editField?.field === "ponticDesign" && (
            <PonticSelector
              value={editFieldValue as string}
              onChange={(val) => setEditFieldValue(val)}
            />
          )}
          {editField?.field === "notes" && (
            <FormField
              id="notes"
              label="Notes"
              type="textarea"
              value={editFieldValue as string}
              onChange={(value) => setEditFieldValue(value)}
              placeholder="Any special instructions for notes..."
              rows={3}
            />
          )}
          {editField?.field === "trialRequirements" && (
            <TrialSelector
              productType={
                group.prescriptionType === "implant"
                  ? "implant"
                  : "crown-bridge"
              }
              selectedTrials={[editFieldValue as string]}
              onTrialsChange={(trials) =>
                setEditFieldValue(trials && trials.length > 0 ? trials[0] : "")
              }
            />
          )}
          {editField?.field === "shadeNotes" && (
            <FormField
              id="shadeNotes"
              label="Shade Notes"
              type="textarea"
              value={editFieldValue as string}
              onChange={(value) => setEditFieldValue(value)}
              placeholder="Any special instructions for shade..."
              rows={2}
            />
          )}
          <div className="flex justify-end mt-4 gap-2">
            <Button variant="outline" onClick={() => setEditField(null)}>
              Cancel
            </Button>
            <Button
              className="bg-[#11AB93] hover:bg-[#0F9A82] text-white"
              onClick={handleSaveField}
            >
              Save
            </Button>
          </div>
        </div>
      </BaseModal>

      <BaseModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title="Add Product to Selected Teeth"
        // height="h-[50vh]"
        overflow="visible"
      >
        <div className="flex flex-col h-full justify-between">
          <ProductSearch
            selectedProducts={modalSelectedProducts}
            onProductsChange={setModalSelectedProducts}
            selectedTeeth={selectedTeethForProducts}
            restorationType="separate"
            prescriptionType={formData.prescriptionType}
            subcategoryType={formData.subcategoryType}
          />
          {/* Selected Products Summary */}
          {modalSelectedProducts.length > 0 && (
            <div className="mt-4 mb-2 px-2 py-2 bg-gray-50 rounded border border-gray-200">
              <div className="font-medium text-gray-700 mb-1 text-sm">
                Selected Products:
              </div>
              <ul className="list-disc pl-5 text-gray-800 text-sm">
                {modalSelectedProducts.map((prod, idx) => (
                  <li key={prod.id || idx}>{prod.name}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex justify-end mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setIsProductModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProductsToTeeth}
              disabled={modalSelectedProducts.length === 0}
              className="bg-[#11AB93] hover:bg-[#0F9A82] text-white"
            >
              Add Product
            </Button>
          </div>
        </div>
      </BaseModal>
    </Card>
  );
};

export default ProductCard;
