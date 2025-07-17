import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProductSearch from "./ProductSearch";
import ShadeSelector, { ShadeOption, shadeOptions } from "./ShadeSelector";
import FormField from "@/components/shared/FormField";
import TrialSelector from "./components/TrialSelector";
import ShadeGuideSection from "./components/ShadeGuideSection";
import { CheckCircle, Plus, Pencil } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import React from "react";
import ImplantTypeSelector from "./components/ImplantTypeSelector";
import ProductCard from "./components/ProductCard";
import { ShadeGuide } from "@/types/orderType";
import PonticSelector from "./components/PonticSelector";

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
  shadeGuide?: ShadeGuide | null;
  productName: string[];
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

const ProductSelection = ({
  formData,
  setFormData,
  onAddMoreProducts,
}: ProductSelectionProps) => {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  );
  const [productDetails, setProductDetails] = useState<ProductDetails>({
    shade: [],
    occlusalStaining: "medium",
    ponticDesign: "",
    notes: "",
    trial: "",
    shadeNotes: "",
    additionalNotes: "",
    shadeGuide: null,
    productName: [],
  });
  const [editingGroupIndex, setEditingGroupIndex] = useState<number | null>(
    null
  );
  const [selectedTeethForProducts, setSelectedTeethForProducts] = useState<
    number[]
  >([]);
  const [isAddingProductForSelectedTeeth, setIsAddingProductForSelectedTeeth] =
    useState(false);
  // const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  // const [modalSelectedProducts, setModalSelectedProducts] = useState<
  //   SelectedProduct[]
  // >([]);

  const [implantSelections, setImplantSelections] = useState<{
    retentionType: { value: string; provider: string; quantity: number } | null;
    abutmentType: { value: string; provider: string; quantity: number } | null;
  }>({
    retentionType: null,
    abutmentType: null,
  });

  const isMobile = useIsMobile();
  const [providerPopupOpen, setProviderPopupOpen] = useState(false);

  console.log(" %c formData", "background: #FF0000; color: white;", formData);

  // --- MIGRATION: On mount, move any group-level fields from first tooth to group if needed ---
  useEffect(() => {
    const updatedGroups = (formData?.teethGroups as any[])?.map((group: any) => {
      const firstTooth = group.teethDetails?.[0]?.[0];
      let changed = false;
      const newGroup = { ...group };
      [
        "shadeDetails",
        "shadeGuide",
        "shadeNotes",
        "occlusalStaining",
        "trialRequirements",
      ].forEach((field) => {
        if (!group[field] && firstTooth && firstTooth[field]) {
          newGroup[field] = firstTooth[field];
          changed = true;
        }
      });
      return newGroup;
    });
    setFormData((f: any) => ({ ...f, teethGroups: updatedGroups }));
    // eslint-disable-next-line
  }, []);

  const getAllGroups = () => {
    const teethGroups = formData.teethGroups || [];
    const groupedTeeth = new Set(
      teethGroups.flatMap(
        (g: any) => g.teethDetails?.flat().map((t: any) => t.toothNumber) || []
      )
    );
    const individualTeeth = (formData.selectedTeeth || [])
      .map((t: any) => ({
        ...t,
        selectedProducts: t.selectedProducts || [],
        productDetails: t.productDetails || {},
      }))
      .filter((t: any) => !groupedTeeth.has(t.toothNumber));

    // Group individual teeth by prescription type
    const groupedByPrescriptionType = individualTeeth.reduce(
      (acc: any, tooth: any) => {
        const prescriptionType = tooth.prescriptionType || "unknown";
        if (!acc[prescriptionType]) {
          acc[prescriptionType] = [];
        }
        acc[prescriptionType].push(tooth);
        return acc;
      },
      {}
    );

    let allGroups = [...teethGroups];
    console.log(
      "%c allGroups",
      "background: #0000FF; color: white;",
      allGroups
    );

    // Process each prescription type separately
    Object.entries(groupedByPrescriptionType).forEach(
      ([prescriptionType, teeth]) => {
        const teethArray = teeth as any[];
        const configuredTeeth = teethArray.filter(
          (t: any) =>
            (t.selectedProducts && t.selectedProducts.length > 0) ||
            (t.productName && t.productName.length > 0)
        );

        const unconfiguredTeeth = teethArray.filter(
          (t: any) =>
            !(t.selectedProducts && t.selectedProducts.length > 0) &&
            !(t.productName && t.productName.length > 0)
        );

        // Add configured individual teeth as a separate group for display
        if (configuredTeeth.length > 0) {
          allGroups.push({
            groupType: "individual",
            teethDetails: [configuredTeeth],
            prescriptionType: prescriptionType,
            isConfigured: true,
          });
        }

        // Add unconfigured individual teeth as a separate group
        if (unconfiguredTeeth.length > 0) {
          allGroups.push({
            groupType: "individual",
            teethDetails: [unconfiguredTeeth],
            prescriptionType: prescriptionType,
            isConfigured: false,
          });
        }
      }
    );

    return allGroups;
  };
  const allGroups = getAllGroups();

  // Show individual teeth if there are no non-individual groups, even if not configured
  const hasNonIndividualGroups = allGroups.some(
    (g: any) => g.groupType !== "individual"
  );
  const renderableGroups = allGroups.filter(
    (g: any) =>
      g.groupType !== "individual" ||
      g.isConfigured ||
      (!hasNonIndividualGroups && g.groupType === "individual")
  );

  // Use allGroups for display/configuration logic below
  const isGroupConfigured = (group: any) => {
    const allTeeth = group.teethDetails?.flat() || [];
    if (allTeeth.length === 0) return false;

    const result = allTeeth.every((t: any) => {
      const hasSelectedProducts =
        t.selectedProducts && t.selectedProducts.length > 0;
      const hasProductName = t.productName && t.productName.length > 0;

      // A tooth is configured if it has either selectedProducts OR productName
      const isConfigured = hasSelectedProducts || hasProductName;
      return isConfigured;
    });

    // console.log(`Group ${group.groupType} configuration status:`, result);
    if (!result) {
      console.log("Unconfigured group:", group, "teeth:", allTeeth);
    }
    return result;
  };

  const allGroupsConfigured =
    allGroups.length > 0 &&
    allGroups.every((group: any) => isGroupConfigured(group));
  // console.log(allGroupsConfigured, "this is a all moasdaisdjasijd");
  // Get unconfigured groups only
  const unconfiguredGroups = allGroups.filter(
    (group: any) => !isGroupConfigured(group)
  );
  // Calculate total teeth count across unconfigured groups only
  const totalTeethCount = unconfiguredGroups.reduce(
    (total: number, group: any) => {
      return total + (group.teethDetails?.flat().length || 0);
    },
    0
  );
  // Get teeth numbers from unconfigured groups only
  const allTeethNumbers = unconfiguredGroups.flatMap(
    (group: any) =>
      group.teethDetails?.flat().map((t: any) => t.toothNumber) || []
  );

  let editingTeethNumbers: number[] = [];
  if (isConfiguring) {
    if (editingGroupIndex !== null) {
      // Editing a specific group - only include unconfigured teeth
      const group = allGroups[editingGroupIndex];
      const unconfiguredTeeth =
        group?.teethDetails
          ?.flat()
          .filter(
            (t: any) =>
              !(t.selectedProducts && t.selectedProducts.length > 0) &&
              !(t.productName && t.productName.length > 0)
          ) || [];
      editingTeethNumbers = unconfiguredTeeth.map(
        (t: any) => t.toothNumber || t.teethNumber
      );
    } else {
      // Editing all unconfigured teeth across all groups
      editingTeethNumbers = unconfiguredGroups.flatMap(
        (group: any) =>
          group.teethDetails
            ?.flat()
            .filter(
              (t: any) =>
                !(t.selectedProducts && t.selectedProducts.length > 0) &&
                !(t.productName && t.productName.length > 0)
            )
            .map((t: any) => t.toothNumber || t.teethNumber) || []
      );
    }
  } else {
    // Default to unconfigured teeth only
    editingTeethNumbers = unconfiguredGroups.flatMap(
      (group: any) =>
        group.teethDetails
          ?.flat()
          .filter(
            (t: any) =>
              !(t.selectedProducts && t.selectedProducts.length > 0) &&
              !(t.productName && t.productName.length > 0)
          )
          .map((t: any) => t.toothNumber || t.teethNumber) || []
    );
  }

  const handleProductDetailsChange = (
    field: keyof ProductDetails,
    value: any
  ) => {
    setProductDetails((prev) => {
      if (field === "shade") {
        // Always store as array
        return { ...prev, shade: value ? [value.label || value] : [] };
      } else if (field === "shadeGuide") {
        return { ...prev, shadeGuide: value };
      } else if (field === "ponticDesign") {
        return { ...prev, ponticDesign: value };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleTrialsChange = (trials: string[]) => {
    setProductDetails((prev) => ({
      ...prev,
      trial: trials && trials.length > 0 ? trials[0] : "",
    }));
  };

  const startConfiguring = () => {
    setIsConfiguring(true);
    // Start fresh for each new configuration session
    // Don't pre-load existing configurations to allow different products for different groups
    setSelectedProducts([]);
    setProductDetails({
      shade: [],
      occlusalStaining: "medium",
      ponticDesign: "",
      notes: "",
      trial: "",
      shadeNotes: "",
      additionalNotes: "",
      shadeGuide: null,
      productName: [],
    });
  };

  const saveConfiguration = () => {
    try {
      const {
        trial,
        shade,
        shadeNotes,
        additionalNotes,
        shadeGuide,
        occlusalStaining,
        ...productDetailsWithoutExtras
      } = productDetails;
      let updatedGroups = [...allGroups];
      let updatedSelectedTeeth = [...formData.selectedTeeth];

      // Remove any synthetic 'individual' group before saving
      updatedGroups = updatedGroups.filter(
        (g: any) => g.groupType !== "individual"
      );

      if (
        isAddingProductForSelectedTeeth &&
        selectedTeethForProducts.length > 0
      ) {
        updatedGroups = updatedGroups.map((group: any) => {
          const updatedTeethDetails = group.teethDetails.map((arr: any) =>
            arr.map((tooth: any) => {
              const toothNumber = tooth.toothNumber || tooth.teethNumber;
              // Only update if this tooth is in selectedTeethForProducts
              if (selectedTeethForProducts.includes(toothNumber)) {
                const existingProducts = tooth.selectedProducts || [];
                const newProducts = selectedProducts.filter(
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
                  shadeGuide: shadeGuide,
                  shadeNotes: shadeNotes,
                  trialRequirements: trial,
                  occlusalStaining: occlusalStaining,
                  productDetails: {
                    ...tooth.productDetails,
                    quantity: (() => {
                      const singleUnitPrescriptionTypes = [
                        "splints-guards",
                        "ortho",
                        "dentures",
                        "sleep-accessories",
                      ];
                      return singleUnitPrescriptionTypes.includes(
                        formData.prescriptionType || ""
                      )
                        ? 1
                        : selectedTeethForProducts.length || 1;
                    })(),
                    shade:
                      productDetails.shade[0] ||
                      tooth.productDetails?.shade ||
                      "",
                    productName: [
                      ...(tooth.productDetails?.productName || []),
                      ...newProducts.map((p: any) => p.name),
                    ],
                    shadeGuide: shadeGuide,
                    shadeNotes: shadeNotes,
                    trial: trial,
                    occlusalStaining: occlusalStaining,
                  },
                };
              }
              // Otherwise, leave the tooth unchanged
              return tooth;
            })
          );
          return {
            ...group,
            teethDetails: updatedTeethDetails,
          };
        });
      } else {
        if (typeof editingGroupIndex === "number") {
          // Only update the group at editingGroupIndex if it is implant or joint/bridge
          updatedGroups = updatedGroups.map((g: any, idx: number) => {
            if (
              idx === editingGroupIndex &&
              (g.groupType === "joint" ||
                g.groupType === "bridge" ||
                g.groupType === "implant")
            ) {
              const updatedTeethDetails = g.teethDetails.map((arr: any) =>
                arr.map((tooth: any) => {
                  const toothNumber = tooth.toothNumber || tooth.teethNumber;
                  // Only update if this tooth is in editingTeethNumbers
                  if (editingTeethNumbers.includes(toothNumber)) {
                    return {
                      ...tooth,
                      selectedProducts: [...selectedProducts],
                      productName: selectedProducts.map((p: any) => p.name),
                      shadeGuide: shadeGuide,
                      shadeNotes: shadeNotes,
                      trialRequirements: trial,
                      occlusalStaining: occlusalStaining,
                      productDetails: {
                        ...productDetailsWithoutExtras,
                        quantity: (() => {
                          if (
                            archBasedPrescriptionTypes.includes(
                              formData.prescriptionType || ""
                            )
                          ) {
                            const hasUpperTeeth = editingTeethNumbers.some(
                              (tooth) => upperArchTeeth.includes(tooth)
                            );
                            const hasLowerTeeth = editingTeethNumbers.some(
                              (tooth) => lowerArchTeeth.includes(tooth)
                            );

                            if (hasUpperTeeth && hasLowerTeeth) {
                              return 2; // Both arches
                            } else if (hasUpperTeeth || hasLowerTeeth) {
                              return 1; // Single arch
                            }
                            return 1; // Default fallback
                          }

                          return editingTeethNumbers.length || 1;
                        })(),
                        shade: productDetails.shade[0] || "",
                        productName: selectedProducts.map((p: any) => p.name),
                        shadeGuide: shadeGuide,
                        shadeNotes: shadeNotes,
                        trial: trial,
                        occlusalStaining: occlusalStaining,
                      },
                    };
                  }
                  // Otherwise, leave the tooth unchanged
                  return tooth;
                })
              );
              return {
                ...g,
                teethDetails: updatedTeethDetails,
                prescriptionType: formData.prescriptionType,
              };
            }
            return g;
          });
        } else {
          // null: update all groups of the same type (as before)
          const typeToEdit = formData.prescriptionType;
          updatedGroups = updatedGroups.map((group: any) => {
            if (
              (group.prescriptionType || formData.prescriptionType) ===
                typeToEdit &&
              (group.groupType === "joint" ||
                group.groupType === "bridge" ||
                group.groupType === "implant")
            ) {
              const updatedTeethDetails = group.teethDetails.map((arr: any) =>
                arr.map((tooth: any) => {
                  const toothNumber = tooth.toothNumber || tooth.teethNumber;
                  // Only update if this tooth is in editingTeethNumbers
                  if (editingTeethNumbers.includes(toothNumber)) {
                    return {
                      ...tooth,
                      selectedProducts: [...selectedProducts],
                      productName: selectedProducts.map((p: any) => p.name),
                      shadeGuide: shadeGuide,
                      shadeNotes: shadeNotes,
                      trialRequirements: trial,
                      occlusalStaining: occlusalStaining,
                      productDetails: {
                        ...productDetailsWithoutExtras,
                        quantity: (() => {
                          if (
                            archBasedPrescriptionTypes.includes(
                              formData.prescriptionType || ""
                            )
                          ) {
                            const hasUpperTeeth = editingTeethNumbers.some(
                              (tooth) => upperArchTeeth.includes(tooth)
                            );
                            const hasLowerTeeth = editingTeethNumbers.some(
                              (tooth) => lowerArchTeeth.includes(tooth)
                            );

                            if (hasUpperTeeth && hasLowerTeeth) {
                              return 2; // Both arches
                            } else if (hasUpperTeeth || hasLowerTeeth) {
                              return 1; // Single arch
                            }
                            return 1; // Default fallback
                          }

                          return editingTeethNumbers.length || 1;
                        })(),
                        shade: productDetails.shade[0] || "",
                        productName: selectedProducts.map((p: any) => p.name),
                        shadeGuide: shadeGuide,
                        shadeNotes: shadeNotes,
                        trial: trial,
                        occlusalStaining: occlusalStaining,
                      },
                    };
                  }
                  // Otherwise, leave the tooth unchanged
                  return tooth;
                })
              );
              return {
                ...group,
                teethDetails: updatedTeethDetails,
                prescriptionType: formData.prescriptionType,
              };
            }
            return group;
          });
          updatedSelectedTeeth = updatedSelectedTeeth.map((tooth: any) => {
            if (
              tooth.prescriptionType === typeToEdit &&
              editingTeethNumbers.includes(tooth.toothNumber)
            ) {
              return {
                ...tooth,
                selectedProducts: [...selectedProducts],
                productName: selectedProducts.map((p: any) => p.name),
                shadeGuide: shadeGuide,
                shadeNotes: shadeNotes,
                trialRequirements: trial,
                occlusalStaining: occlusalStaining,
                productDetails: {
                  ...productDetailsWithoutExtras,
                  shade: productDetails.shade[0] || "",
                  productName: selectedProducts.map((p: any) => p.name),
                  shadeGuide: shadeGuide,
                  shadeNotes: shadeNotes,
                  trial: trial,
                  occlusalStaining: occlusalStaining,
                },
              };
            }
            // Otherwise, leave the tooth unchanged
            return tooth;
          });
        }
      }

      // --- DEMO: After updating teethDetails, set group-level fields from first tooth or config form ---
      const groupLevelFields = [
        "shadeDetails",
        "shadeGuide",
        "shadeNotes",
        "occlusalStaining",
        "trialRequirements",
        "ponticDesign",
      ];
      updatedGroups = updatedGroups.map((group: any) => {
        const firstTooth = group.teethDetails?.[0]?.[0];
        groupLevelFields.forEach((field) => {
          if (field === "shadeGuide") {
            // Prefer productDetails.shadeGuide if present, else from firstTooth
            if (productDetails.shadeGuide && productDetails.shadeGuide.type) {
              group.shadeGuide = productDetails.shadeGuide;
            } else if (
              firstTooth &&
              firstTooth.shadeGuide &&
              firstTooth.shadeGuide.type
            ) {
              group.shadeGuide = firstTooth.shadeGuide;
            }
          } else if (field === "ponticDesign") {
            if (productDetails.ponticDesign) {
              group.ponticDesign = productDetails.ponticDesign;
            } else if (firstTooth && firstTooth.ponticDesign) {
              group.ponticDesign = firstTooth.ponticDesign;
            }
          } else if (firstTooth && firstTooth[field]) {
            group[field] = firstTooth[field];
          } else if (field === "shadeDetails" && shade && shade.length > 0) {
            group[field] = shade[0];
          } else if (field === "shadeNotes" && shadeNotes) {
            group[field] = shadeNotes;
          } else if (field === "occlusalStaining" && occlusalStaining) {
            group[field] = occlusalStaining;
          } else if (field === "trialRequirements" && trial) {
            group[field] = trial;
          }
        });
        // Remove from all teeth
        group.teethDetails = group.teethDetails.map((arr: any[]) =>
          arr.map((tooth: any) => {
            const rest = { ...tooth };
            groupLevelFields.forEach((field) => delete rest[field]);
            return rest;
          })
        );
        return group;
      });

      // Build restorationProducts array by aggregating products across all configured groups and individual teeth
      const productMap: Record<string, { product: string; quantity: number }> =
        {};
      const accessoriesSet = new Set<string>();

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
      updatedSelectedTeeth.forEach((tooth: any) => {
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

      const restorationProducts = Object.values(productMap);
      const accessories = Array.from(accessoriesSet);

      const newFormData = {
        ...formData,
        teethGroups: updatedGroups, // only real groups
        selectedTeeth: updatedSelectedTeeth, // all individual teeth
        restorationProducts,
        accessories,
        // Removed: trial, shade, shadeNotes, additionalNotes, shadeGuide, productName at root
      };

      setFormData(newFormData);

      setTimeout(() => {
        setIsConfiguring(false);
        setSelectedProducts([selectedProducts[selectedProducts.length - 1]]);
        setProductDetails({
          shade: [],
          occlusalStaining: "medium",
          ponticDesign: "",
          notes: "",
          trial: "",
          shadeNotes: "",
          additionalNotes: "",
          shadeGuide: null,
          productName: [],
        });
        setEditingGroupIndex(null);
        setSelectedTeethForProducts([]);
        setIsAddingProductForSelectedTeeth(false);
      }, 0);
    } catch (error) {
      console.error("Error saving configuration:", error);
    }
  };

  const cancelConfiguring = () => {
    setIsConfiguring(false);
    setSelectedProducts([]);
    setProductDetails({
      shade: [],
      occlusalStaining: "medium",
      ponticDesign: "",
      notes: "",
      trial: "",
      shadeNotes: "",
      additionalNotes: "",
      shadeGuide: null,
      productName: [],
    });
    setEditingGroupIndex(null);
    setSelectedTeethForProducts([]);
    setIsAddingProductForSelectedTeeth(false);
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
      teethGroups: formData.teethGroups,
      completedAt: new Date().toISOString(),
    };

    setFormData({
      ...formData,
      restorationInfo,
    });
  };

  useEffect(() => {
    if (!isConfiguring && unconfiguredGroups.length > 0) {
      // console.log("unconfiguredGroups", unconfiguredGroups);
      startConfiguring();
    }
    // Optionally, add dependencies if you want to trigger on step change
    // eslint-disable-next-line
  }, []);

  // Handler for opening the modal
  // const openProductModal = () => {
  //   setModalSelectedProducts([]);
  //   setIsProductModalOpen(true);
  // };

  // Handler for saving products from modal
  // const handleSaveProductsToTeeth = () => {
  //   // Update selected products for selectedTeethForProducts in the group
  //   let updatedGroups = [...allGroups];
  //   updatedGroups = updatedGroups.map((group: any) => {
  //     const updatedTeethDetails = group.teethDetails.map((arr: any) =>
  //       arr.map((tooth: any) => {
  //         const toothNumber = tooth.toothNumber || tooth.teethNumber;
  //         if (selectedTeethForProducts.includes(toothNumber)) {
  //           // Add new products to existing products
  //           const existingProducts = tooth.selectedProducts || [];
  //           const newProducts = modalSelectedProducts.filter(
  //             (newProd: any) =>
  //               !existingProducts.some(
  //                 (existing: any) => existing.id === newProd.id
  //               )
  //           );
  //           return {
  //             ...tooth,
  //             selectedProducts: [...existingProducts, ...newProducts],
  //             productName: [
  //               ...(tooth.productName || []),
  //               ...newProducts.map((p: any) => p.name),
  //             ],
  //             shadeGuide: productDetails.shadeGuide,
  //             shadeNotes: productDetails.shadeNotes,
  //             trialRequirements: productDetails.trial,
  //             occlusalStaining: productDetails.occlusalStaining,
  //             productDetails: {
  //               ...tooth.productDetails,
  //               productName: [
  //                 ...(tooth.productDetails?.productName || []),
  //                 ...newProducts.map((p: any) => p.name),
  //               ],
  //               shadeGuide: productDetails.shadeGuide,
  //               shadeNotes: productDetails.shadeNotes,
  //               trial: productDetails.trial,
  //               occlusalStaining: productDetails.occlusalStaining,
  //             },
  //           };
  //         }
  //         return tooth;
  //       })
  //     );
  //     return {
  //       ...group,
  //       teethDetails: updatedTeethDetails,
  //     };
  //   });
  //   // console.log("updatedGroups", updatedGroups)
  //   setFormData({
  //     ...formData,
  //     teethGroups: updatedGroups,
  //   });
  //   setIsProductModalOpen(false);
  //   setSelectedTeethForProducts([]);
  // };

  // Helper to aggregate product quantities across all teeth in all groups
  const getProductQuantities = () => {
    const productMap: Record<string, number> = {};
    allGroups.forEach((group: any) => {
      group.teethDetails?.flat().forEach((tooth: any) => {
        let counted = false;
        // Prefer selectedProducts if present and non-empty
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
        // Otherwise, use productName
        if (!counted && tooth.productName && Array.isArray(tooth.productName)) {
          tooth.productName.forEach((name: string) => {
            if (name) {
              productMap[name] = (productMap[name] || 0) + 1;
            }
          });
        }
      });
    });
    return Object.entries(productMap).map(([name, quantity]) => ({
      name,
      quantity,
    }));
  };

  return (
    <div className="space-y-6 bg-transparent">
      {renderableGroups.length > 0 ? (
        <>
          {/* Completion Status */}
          {allGroupsConfigured && (
            <Card className="border border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">
                    Product configuration completed for all{" "}
                    {renderableGroups.length} group
                    {renderableGroups.length > 1 ? "s" : ""}
                  </span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Ready to proceed to next step
                </p>
              </CardContent>
            </Card>
          )}

          {/* Configured Groups Detail Cards - Show all configured groups */}
          {renderableGroups.filter((group) => isGroupConfigured(group)).length >
            0 &&
            (
              Object.entries(
                renderableGroups
                  .filter((group) => isGroupConfigured(group))
                  .reduce((acc: any, group: any) => {
                    const type =
                      group.prescriptionType || formData.prescriptionType;
                    if (!acc[type]) acc[type] = [];
                    acc[type].push(group);
                    return acc;
                  }, {})
              ) as [string, any[]][]
            ).map(([type, groups], idx) => {
              return (
                <>
                  <ProductCard
                    type={type}
                    groups={groups}
                    allGroups={allGroups}
                    formData={formData}
                    groupIdx={idx}
                    onSaveGroupFields={(groupIdx, field, value) => {
                      // Update formData in parent
                      const updatedGroups = [...formData.teethGroups];
                      updatedGroups[groupIdx] = {
                        ...updatedGroups[groupIdx],
                        [field]: value,
                      };
                      setFormData({ ...formData, teethGroups: updatedGroups });
                    }}
                    setFormData={setFormData}
                  />
                </>
              );
            })}

          {/* Product Quantities Summary */}
          {getProductQuantities().length > 0 && (
            <Card className="border border-gray-200 bg-gray-50">
              <CardContent className="p-4">
                <h6 className="text-sm font-semibold mb-3 text-gray-900">
                  Product Quantities
                </h6>
                <div className="space-y-2">
                  {getProductQuantities().map((item) => (
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
          )}

          {/* Tooth Groups Summary for unconfigured groups */}
          {unconfiguredGroups.length > 0 && (
            <Card className="border-none p-0 bg-transparent">
              <CardHeader className="pb-3 p-0">
                <CardTitle className="text-lg">Product Selection</CardTitle>
                <CardDescription>
                  Groups waiting to be configured
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 mt-2">
                <div className="flex flex-wrap gap-2 items-center">
                  {unconfiguredGroups
                    .sort((a: any, b: any) => {
                      // Order: bridge first, then joint, then individual
                      const order = { bridge: 1, joint: 2, individual: 3 };
                      return (
                        (order[a.groupType as keyof typeof order] || 4) -
                        (order[b.groupType as keyof typeof order] || 4)
                      );
                    })
                    .map((group: any, index: number) => {
                      // Filter out configured teeth from the display
                      const unconfiguredTeeth = group.teethDetails
                        ?.flat()
                        .filter(
                          (t: any) =>
                            !(
                              t.selectedProducts &&
                              t.selectedProducts.length > 0
                            ) && !(t.productName && t.productName.length > 0)
                        );
                      return unconfiguredTeeth &&
                        unconfiguredTeeth.length > 0 ? (
                        <div
                          key={index}
                          className={`flex border h-10 py-3 px-5 items-center text-white ${
                            group.groupType === "individual"
                              ? "bg-[#1D4ED8] border-[#4574F9]"
                              : group.groupType === "joint"
                              ? "bg-[#0B8043] border-[#10A457]"
                              : "bg-[#EA580C] border-[#FF7730]"
                          } rounded-lg w-fit capitalize`}
                        >
                          <div>
                            <span className="font-medium">
                              {group.groupType}:
                            </span>
                            <span className=" ml-2">
                              {unconfiguredTeeth
                                .map((t: any) => t.toothNumber ?? t.teethNumber)
                                .filter(
                                  (n: any) =>
                                    n !== undefined && n !== null && n !== ""
                                )
                                .join(", ")}
                            </span>
                          </div>
                        </div>
                      ) : null;
                    })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Single Product Configuration Box - Only show if there are unconfigured groups */}
          {isConfiguring && (
            <Card className="border-none p-0 bg-transparent">
              <CardContent className="p-0">
                <div className="space-y-4">
                  {/* Abutment Type Selection - Only show for implant prescription type */}
                  {formData.prescriptionType === "implant" && (
                    <ImplantTypeSelector
                      formData={formData}
                      setFormData={setFormData}
                      editingTeethNumbers={editingTeethNumbers}
                      implantSelections={implantSelections}
                      setImplantSelections={setImplantSelections}
                      onProviderPopupOpen={setProviderPopupOpen}
                    />
                  )}
                  {/* Only show ProductSearch and config UI if provider popup is NOT open */}
                  {!providerPopupOpen && (
                    <>
                      <ProductSearch
                        selectedProducts={selectedProducts}
                        onProductsChange={setSelectedProducts}
                        selectedTeeth={
                          isAddingProductForSelectedTeeth
                            ? selectedTeethForProducts
                            : editingTeethNumbers
                        }
                        restorationType="separate"
                        prescriptionType={formData.prescriptionType}
                        subcategoryType={formData.subcategoryType}
                      />
                      {/* Product Details Form */}
                      {selectedProducts.length > 0 && (
                        <div className="mt-4 space-y-4">
                          <h5 className="text-sm font-medium text-gray-900">
                            Shade Details
                          </h5>

                          {/* Shade Selection */}
                          <ShadeSelector
                            value={
                              shadeOptions.find(
                                (opt) => opt.label === productDetails.shade[0]
                              ) || null
                            }
                            onValueChange={(value) =>
                              handleProductDetailsChange("shade", value)
                            }
                            label="Shade"
                            placeholder="Select Shade"
                          />

                          {/* Occlusal Staining */}
                          <FormField
                            id="occlusalStaining"
                            label="Occlusal Staining"
                            type="select"
                            value={productDetails.occlusalStaining}
                            onChange={(value) =>
                              handleProductDetailsChange(
                                "occlusalStaining",
                                value
                              )
                            }
                            options={[
                              { value: "light", label: "Light" },
                              { value: "medium", label: "Medium" },
                              { value: "heavy", label: "Heavy" },
                            ]}
                          />

                          <div className="border-t pt-4">
                            <h6 className="text-sm font-medium text-gray-900 mb-3">
                              Select Pontic
                            </h6>
                            <PonticSelector
                              value={productDetails.ponticDesign}
                              onChange={(val) =>
                                handleProductDetailsChange("ponticDesign", val)
                              }
                            />
                          </div>

                          {/* Shade Guide Section */}
                          <div className="border-t pt-4">
                            <h6 className="text-sm font-medium text-gray-900 mb-3">
                              Shade Guide
                            </h6>
                            <ShadeGuideSection
                              selectedGroups={[]}
                              onShadeGuideChange={(guide) =>
                                handleProductDetailsChange("shadeGuide", guide)
                              }
                              selectedGuide={productDetails.shadeGuide || null}
                            />
                            {/* Show current value if present */}
                            {productDetails.shadeGuide &&
                              productDetails.shadeGuide.type &&
                              productDetails.shadeGuide.shades &&
                              productDetails.shadeGuide.shades.length > 0 && (
                                <div className="mt-2 text-xs text-gray-700">
                                  <span className="font-semibold">
                                    {productDetails.shadeGuide.type ===
                                    "anterior"
                                      ? "Anterior"
                                      : "Posterior"}
                                    :
                                  </span>
                                  {productDetails.shadeGuide.shades.map(
                                    (shade: any, idx: any) => (
                                      <span key={idx} className="ml-2">
                                        {shade}
                                      </span>
                                    )
                                  )}
                                </div>
                              )}
                          </div>

                          {/* Additional Notes */}
                          <FormField
                            id="shadeNotes"
                            label="Shade Notes"
                            type="textarea"
                            value={productDetails.shadeNotes || ""}
                            onChange={(value) =>
                              setProductDetails((prev) => ({
                                ...prev,
                                shadeNotes: value,
                              }))
                            }
                            placeholder="Any special instructions for shade..."
                            rows={2}
                          />

                          {/* Trial Requirements */}
                          <TrialSelector
                            productType={
                              formData.prescriptionType === "implant"
                                ? "implant"
                                : "crown-bridge"
                            }
                            selectedTrials={[productDetails.trial]}
                            onTrialsChange={handleTrialsChange}
                          />

                          {/* Action Buttons */}
                          <div className="flex gap-2 justify-end  flex-col sm:flex-row ">
                            {isMobile && (
                              <Button
                                type="button"
                                onClick={saveConfiguration}
                                className="bg-[#11AB93] hover:bg-[#0F9A82] text-white w-full sm:w-min px-4 py-3"
                                disabled={
                                  !productDetails.shade.length ||
                                  selectedProducts.length === 0
                                }
                              >
                                Save Configuration
                              </Button>
                            )}
                            <Button
                              type="button"
                              onClick={cancelConfiguring}
                              variant="outline"
                              className="w-full sm:w-min"
                            >
                              Cancel
                            </Button>
                            {!isMobile && (
                              <Button
                                type="button"
                                onClick={saveConfiguration}
                                className="bg-[#11AB93] hover:bg-[#0F9A82] text-white w-full sm:w-min px-4 py-3"
                                disabled={
                                  !productDetails.shade.length ||
                                  selectedProducts.length === 0
                                }
                              >
                                Save Configuration
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </>
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
                <p className="text-sm text-gray-500 mt-2">
                  Configure additional teeth with different products
                </p>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {renderableGroups.length === 0
              ? "Please complete teeth selection in the previous step"
              : "All tooth groups are already configured"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductSelection;
