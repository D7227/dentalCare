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
import ShadeSelector, { ShadeOption } from "./ShadeSelector";
import FormField from "@/components/shared/FormField";
import TrialSelector from "./components/TrialSelector";
import ShadeGuideSection, { ShadeGuide } from "./components/ShadeGuideSection";
import { CheckCircle, Plus, Pencil } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import BaseModal from "@/components/shared/BaseModal";
import PonticSelector from "./components/PonticSelector";
import React from "react";
import ImplantTypeSelector from "./components/ImplantTypeSelector";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

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

const shadeOptions: ShadeOption[] = [
  { value: "a1", label: "A1 - Vita Classic", family: "Vita Classic" },
  { value: "a2", label: "A2 - Vita Classic", family: "Vita Classic" },
  { value: "a3", label: "A3 - Vita Classic", family: "Vita Classic" },
  { value: "a3.5", label: "A3.5 - Vita Classic", family: "Vita Classic" },
  { value: "b1", label: "B1 - Vita Classic", family: "Vita Classic" },
  { value: "b2", label: "B2 - Vita Classic", family: "Vita Classic" },
  { value: "b3", label: "B3 - Vita Classic", family: "Vita Classic" },
  { value: "c1", label: "C1 - Vita Classic", family: "Vita Classic" },
  { value: "c2", label: "C2 - Vita Classic", family: "Vita Classic" },
  { value: "d2", label: "D2 - Vita Classic", family: "Vita Classic" },
  { value: "1m1", label: "1M1 - Vita 3D Master", family: "Vita 3D Master" },
  { value: "1m2", label: "1M2 - Vita 3D Master", family: "Vita 3D Master" },
  { value: "2l1.5", label: "2L1.5 - Vita 3D Master", family: "Vita 3D Master" },
  { value: "2l2.5", label: "2L2.5 - Vita 3D Master", family: "Vita 3D Master" },
  { value: "2m1", label: "2M1 - Vita 3D Master", family: "Vita 3D Master" },
  { value: "2m2", label: "2M2 - Vita 3D Master", family: "Vita 3D Master" },
  { value: "3m1", label: "3M1 - Vita 3D Master", family: "Vita 3D Master" },
  { value: "3m2", label: "3M2 - Vita 3D Master", family: "Vita 3D Master" },
];

const ProductSelection = ({
  formData,
  setFormData,
  onAddMoreProducts,
}: ProductSelectionProps) => {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    [],
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
    null,
  );
  const [selectedTeethForProducts, setSelectedTeethForProducts] = useState<
    number[]
  >([]);
  const [isAddingProductForSelectedTeeth, setIsAddingProductForSelectedTeeth] =
    useState(false);
  const [showProductCheckboxes, setShowProductCheckboxes] = useState<
    Record<string, boolean>
  >({});
  const { toast } = useToast();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [modalSelectedProducts, setModalSelectedProducts] = useState<
    SelectedProduct[]
  >([]);

  // --- 1. Add edit modal state for group/field ---
  const [editField, setEditField] = useState<null | {
    field: string;
    groupIdx: number;
  }>(null);
  const [editFieldValue, setEditFieldValue] = useState<any>("");

  // Provider popup state
  const [showProviderPopup, setShowProviderPopup] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState<
    "retention" | "abutment" | null
  >(null);
  const [selectedItemValue, setSelectedItemValue] = useState<string>("");
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
    const updatedGroups = (formData.toothGroups as any[]).map((group: any) => {
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
    setFormData((f: any) => ({ ...f, toothGroups: updatedGroups }));
    // eslint-disable-next-line
  }, []);

  const getAllGroups = () => {
    const toothGroups = formData.toothGroups || [];
    const groupedTeeth = new Set(
      toothGroups.flatMap(
        (g: any) => g.teethDetails?.flat().map((t: any) => t.toothNumber) || [],
      ),
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
      {},
    );

    let allGroups = [...toothGroups];
    console.log(
      "%c allGroups",
      "background: #0000FF; color: white;",
      allGroups,
    );

    // Process each prescription type separately
    Object.entries(groupedByPrescriptionType).forEach(
      ([prescriptionType, teeth]) => {
        const teethArray = teeth as any[];
        const configuredTeeth = teethArray.filter(
          (t: any) =>
            (t.selectedProducts && t.selectedProducts.length > 0) ||
            (t.productName && t.productName.length > 0),
        );

        const unconfiguredTeeth = teethArray.filter(
          (t: any) =>
            !(t.selectedProducts && t.selectedProducts.length > 0) &&
            !(t.productName && t.productName.length > 0),
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
      },
    );

    return allGroups;
  };
  const allGroups = getAllGroups();

  // Show individual teeth if there are no non-individual groups, even if not configured
  const hasNonIndividualGroups = allGroups.some(
    (g: any) => g.groupType !== "individual",
  );
  const renderableGroups = allGroups.filter(
    (g: any) =>
      g.groupType !== "individual" ||
      g.isConfigured ||
      (!hasNonIndividualGroups && g.groupType === "individual"),
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

      // console.log(
      //   `Tooth ${t.teethNumber || t.toothNumber}: hasSelectedProducts=${hasSelectedProducts}, hasProductName=${hasProductName}, isConfigured=${isConfigured}`,
      // );
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
    (group: any) => !isGroupConfigured(group),
  );
  // Calculate total teeth count across unconfigured groups only
  const totalTeethCount = unconfiguredGroups.reduce(
    (total: number, group: any) => {
      return total + (group.teethDetails?.flat().length || 0);
    },
    0,
  );
  // Get teeth numbers from unconfigured groups only
  const allTeethNumbers = unconfiguredGroups.flatMap(
    (group: any) =>
      group.teethDetails?.flat().map((t: any) => t.toothNumber) || [],
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
              !(t.productName && t.productName.length > 0),
          ) || [];
      editingTeethNumbers = unconfiguredTeeth.map(
        (t: any) => t.toothNumber || t.teethNumber,
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
                !(t.productName && t.productName.length > 0),
            )
            .map((t: any) => t.toothNumber || t.teethNumber) || [],
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
              !(t.productName && t.productName.length > 0),
          )
          .map((t: any) => t.toothNumber || t.teethNumber) || [],
    );
  }

  const handleProductDetailsChange = (
    field: keyof ProductDetails,
    value: any,
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
        (g: any) => g.groupType !== "individual",
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
                      (existing: any) => existing.id === newProd.id,
                    ),
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
                        formData.prescriptionType || "",
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
            }),
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
                          const archBasedPrescriptionTypes = [
                            "splints-guards",
                            "ortho",
                            "dentures",
                            "sleep-accessories",
                          ];

                          if (
                            archBasedPrescriptionTypes.includes(
                              formData.prescriptionType || "",
                            )
                          ) {
                            // Calculate quantity based on arch selection for editing teeth
                            const upperArchTeeth = [
                              11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24,
                              25, 26, 27, 28,
                            ];
                            const lowerArchTeeth = [
                              31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44,
                              45, 46, 47, 48,
                            ];

                            const hasUpperTeeth = editingTeethNumbers.some(
                              (tooth) => upperArchTeeth.includes(tooth),
                            );
                            const hasLowerTeeth = editingTeethNumbers.some(
                              (tooth) => lowerArchTeeth.includes(tooth),
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
                }),
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
                          const archBasedPrescriptionTypes = [
                            "splints-guards",
                            "ortho",
                            "dentures",
                            "sleep-accessories",
                          ];

                          if (
                            archBasedPrescriptionTypes.includes(
                              formData.prescriptionType || "",
                            )
                          ) {
                            // Calculate quantity based on arch selection for editing teeth
                            const upperArchTeeth = [
                              11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24,
                              25, 26, 27, 28,
                            ];
                            const lowerArchTeeth = [
                              31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44,
                              45, 46, 47, 48,
                            ];

                            const hasUpperTeeth = editingTeethNumbers.some(
                              (tooth) => upperArchTeeth.includes(tooth),
                            );
                            const hasLowerTeeth = editingTeethNumbers.some(
                              (tooth) => lowerArchTeeth.includes(tooth),
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
                }),
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
          }),
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
        toothGroups: updatedGroups, // only real groups
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
      toothGroups: formData.toothGroups,
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

  // console.log("4444444 allGroups", allGroups);

  // Handler for opening the modal
  const openProductModal = () => {
    setModalSelectedProducts([]);
    setIsProductModalOpen(true);
  };

  // Handler for saving products from modal
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
                  (existing: any) => existing.id === newProd.id,
                ),
            );
            return {
              ...tooth,
              selectedProducts: [...existingProducts, ...newProducts],
              productName: [
                ...(tooth.productName || []),
                ...newProducts.map((p: any) => p.name),
              ],
              shadeGuide: productDetails.shadeGuide,
              shadeNotes: productDetails.shadeNotes,
              trialRequirements: productDetails.trial,
              occlusalStaining: productDetails.occlusalStaining,
              productDetails: {
                ...tooth.productDetails,
                productName: [
                  ...(tooth.productDetails?.productName || []),
                  ...newProducts.map((p: any) => p.name),
                ],
                shadeGuide: productDetails.shadeGuide,
                shadeNotes: productDetails.shadeNotes,
                trial: productDetails.trial,
                occlusalStaining: productDetails.occlusalStaining,
              },
            };
          }
          return tooth;
        }),
      );
      return {
        ...group,
        teethDetails: updatedTeethDetails,
      };
    });
    // console.log("updatedGroups", updatedGroups)
    setFormData({
      ...formData,
      toothGroups: updatedGroups,
    });
    setIsProductModalOpen(false);
    setSelectedTeethForProducts([]);
  };

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
                  }, {}),
              ) as [string, any[]][]
            ).map(([type, groups], idx) => {
              const group = groups[0]; // Only one group per type for summary
              return (
                <Card
                  key={type}
                  className="border border-green-200 bg-gray-50 mb-4"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 ${type === "implant" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"} text-xs rounded-full font-medium`}
                        >
                          {(() => {
                            switch (type) {
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
                      {/* Edit button for all groups at once (per type) */}
                      <div className="flex gap-2">
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
                        {/* <button
                          type="button"
                          className="p-1 text-gray-400 hover:text-blue-600"
                          onClick={() => {
                            if (isConfiguring && editingGroupIndex === idx) {
                              setIsConfiguring(false);
                              setEditingGroupIndex(null);
                              return;
                            }
                            setIsConfiguring(false);
                            setTimeout(() => {
                              setEditingGroupIndex(idx);
                              setIsConfiguring(true);
                              // Calculate actual product quantities based on tooth count for each unique product
                              const productQuantityMap: Record<string, { product: any; count: number }> = {};
                              groups[idx].teethDetails?.flat().forEach((tooth: any) => {
                                if (tooth.selectedProducts && tooth.selectedProducts.length > 0) {
                                  tooth.selectedProducts.forEach((product: any) => {
                                    if (productQuantityMap[product.id]) {
                                      productQuantityMap[product.id].count += 1;
                                    } else {
                                      productQuantityMap[product.id] = {
                                        product: { ...product },
                                        count: 1,
                                      };
                                    }
                                  });
                                }
                              });
                              const productsWithCorrectQuantities = Object.values(productQuantityMap).map((item) => ({
                                ...item.product,
                                quantity: item.count,
                              }));
                              // Use first tooth's product details for editing
                              const firstTooth = groups[idx]?.teethDetails?.flat()[0];
                              setSelectedProducts(productsWithCorrectQuantities);
                              setProductDetails({
                                shade: firstTooth?.productDetails?.shade ? [firstTooth.productDetails.shade] : [],
                                occlusalStaining: firstTooth?.productDetails?.occlusalStaining || "medium",
                                ponticDesign: firstTooth?.productDetails?.ponticDesign || "",
                                notes: firstTooth?.productDetails?.notes || "",
                                trial: firstTooth?.productDetails?.trial || "",
                                shadeNotes: firstTooth?.productDetails?.shadeNotes || "",
                                additionalNotes: firstTooth?.productDetails?.additionalNotes || "",
                                shadeGuide: (firstTooth?.productDetails?.shadeGuide ?? firstTooth?.shadeGuide) || null,
                                productName: firstTooth?.productDetails?.productName || [],
                              });
                            }, 0);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </button> */}
                        <button
                          type="button"
                          className="p-1 text-gray-400 hover:text-green-600"
                          onClick={() => {
                            toast({
                              title: "Group already configured",
                              description:
                                "This group has already been configured. You can edit it using the pencil icon.",
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
                          {(() => {
                            // Check if this is an arch-based prescription type
                            const archBasedPrescriptionTypes = [
                              "splints-guards",
                              "ortho",
                              "dentures",
                              "sleep-accessories"
                            ];

                            const isArchBased = archBasedPrescriptionTypes.includes(
                              type || formData.prescriptionType || ""
                            );

                            if (isArchBased) {
                              // For arch-based prescriptions, show arch information
                              const upperArchTeeth = [
                                11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28,
                              ];
                              const lowerArchTeeth = [
                                31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48,
                              ];

                              const allTeethInGroups = groups.flatMap(
                                (g: any) => g.teethDetails?.flat() || [],
                              ).map((t: any) => t.toothNumber ?? t.teethNumber);

                              const hasUpperTeeth = allTeethInGroups.some(tooth =>
                                upperArchTeeth.includes(tooth)
                              );
                              const hasLowerTeeth = allTeethInGroups.some(tooth =>
                                lowerArchTeeth.includes(tooth)
                              );

                              return (
                                <div>
                                  {hasUpperTeeth && (
                                    <div>
                                      <span className="font-semibold">Upper Arch</span>
                                    </div>
                                  )}
                                  {hasLowerTeeth && (
                                    <div>
                                      <span className="font-semibold">Lower Arch</span>
                                    </div>
                                  )}
                                </div>
                              );
                            } else {
                              // For fixed-restoration and implant, show individual teeth
                              return ["bridge", "joint", "individual"].map(
                                (groupType) => {
                                  const groupsOfType = groups.filter(
                                    (g: any) => g.groupType === groupType,
                                  );
                                  if (groupsOfType.length === 0) return null;
                                  const teethNumbers = groupsOfType
                                    .flatMap(
                                      (g: any) => g.teethDetails?.flat() || [],
                                    )
                                    .map((t: any) => t.toothNumber ?? t.teethNumber)
                                    .filter(
                                      (n: any) =>
                                        n !== undefined && n !== null && n !== "",
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
                                },
                              );
                            }
                          })()}
                        </div>

                        {/* Show implant details if this is an implant prescription */}
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
                                  return tooth && tooth.implantDetails &&
                                    typeof tooth.implantDetails === 'object' &&
                                    Object.keys(tooth.implantDetails).length > 0 &&
                                    (tooth.implantDetails.companyName || tooth.implantDetails.systemName || tooth.implantDetails.remarks);
                                });

                              // Also check individual teeth with implant prescription type
                              const individualTeethWithImplantDetails = (formData.selectedTeeth || [])
                                .filter((tooth: any) =>
                                  tooth.prescriptionType === "implant" &&
                                  tooth.implantDetails &&
                                  typeof tooth.implantDetails === 'object' &&
                                  Object.keys(tooth.implantDetails).length > 0 &&
                                  (tooth.implantDetails.companyName || tooth.implantDetails.systemName || tooth.implantDetails.remarks)
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
                              const allImplantTeeth = Array.from(teethMap.values()).sort((a: any, b: any) => {
                                const aNum = a.toothNumber || a.teethNumber;
                                const bNum = b.toothNumber || b.teethNumber;
                                return aNum - bNum;
                              });

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
                                    <AccordionItem key={idx} value={`tooth-${tooth.toothNumber || tooth.teethNumber}`} className="border-none mb-2">
                                      <AccordionTrigger className="p-0 text-sm font-normal border border-gray-400 px-2 py-1 rounded-sm">
                                        Tooth {tooth.toothNumber || tooth.teethNumber}
                                      </AccordionTrigger>
                                      <AccordionContent>
                                        <div className="border rounded-md p-2 bg-gray-50 mb-2 flex flex-col gap-2">
                                          {tooth.implantDetails?.companyName && (
                                            <div className="flex gap-2 items-baseline">
                                              <span className="font-semibold text-sm text-gray-800 min-w-[80px]">Company:</span>
                                              <span className="text-gray-700 text-sm">{tooth.implantDetails.companyName}</span>
                                            </div>
                                          )}
                                          {tooth.implantDetails?.systemName && (
                                            <div className="flex gap-2 items-baseline">
                                              <span className="font-semibold text-sm text-gray-800 min-w-[80px]">System:</span>
                                              <span className="text-gray-700 text-sm">{tooth.implantDetails.systemName}</span>
                                            </div>
                                          )}
                                          {tooth.implantDetails?.remarks && (
                                            <div className="flex gap-2 items-baseline">
                                              <span className="font-semibold text-sm text-gray-800 min-w-[80px]">Remarks:</span>
                                              <span className="text-gray-700 text-sm">{tooth.implantDetails.remarks}</span>
                                            </div>
                                          )}
                                          {tooth.implantDetails?.photo && (
                                            <div className="flex flex-col gap-1">
                                              <span className="font-semibold text-sm text-gray-800">Photo:</span>
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
                            {showProductCheckboxes?.[type] &&
                              (() => {
                                const allTeethFromType = groups.flatMap(
                                  (g: any) =>
                                    g.teethDetails
                                      ?.flat()
                                      .map(
                                        (t: any) =>
                                          t.teethNumber || t.toothNumber,
                                      ) || [],
                                );
                                if (allTeethFromType.length > 1) {
                                  return (
                                    <input
                                      type="checkbox"
                                      className="w-3 h-3 rounded border-gray-300"
                                      checked={
                                        selectedTeethForProducts.length ===
                                        allTeethFromType.length &&
                                        allTeethFromType.every((tooth) =>
                                          selectedTeethForProducts.includes(
                                            tooth,
                                          ),
                                        )
                                      }
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedTeethForProducts(
                                            allTeethFromType,
                                          );
                                        } else {
                                          setSelectedTeethForProducts([]);
                                        }
                                      }}
                                    />
                                  );
                                }
                                return null;
                              })()}
                            <p className="font-medium text-gray-900 mb-0">
                              Products:
                            </p>
                          </div>
                        </div>
                        {/* Product display logic for arch-based vs individual teeth */}
                        <div className="text-gray-600 space-y-1 mt-2">
                          {(() => {
                            // Check if this is an arch-based prescription type
                            const archBasedPrescriptionTypes = [
                              "splints-guards",
                              "ortho",
                              "dentures",
                              "sleep-accessories"
                            ];

                            const isArchBased = archBasedPrescriptionTypes.includes(
                              type || formData.prescriptionType || ""
                            );

                            if (isArchBased) {
                              // For arch-based prescriptions, show products by arch
                              const upperArchTeeth = [
                                11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28,
                              ];
                              const lowerArchTeeth = [
                                31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48,
                              ];

                              const allTeethWithProducts = groups.flatMap(
                                (g: any) => g.teethDetails?.flat() || [],
                              );

                              const upperArchProducts = new Set<string>();
                              const lowerArchProducts = new Set<string>();

                              allTeethWithProducts.forEach((tooth: any) => {
                                const toothNum = tooth.toothNumber || tooth.teethNumber;
                                let productNames: string[] = [];

                                if (tooth.selectedProducts && tooth.selectedProducts.length > 0) {
                                  productNames = tooth.selectedProducts.map((p: any) => p.name);
                                } else if (tooth.productName && tooth.productName.length > 0) {
                                  productNames = [...tooth.productName];
                                } else if (tooth.productDetails?.productName && tooth.productDetails.productName.length > 0) {
                                  productNames = [...tooth.productDetails.productName];
                                }

                                if (upperArchTeeth.includes(toothNum)) {
                                  productNames.forEach(name => upperArchProducts.add(name));
                                } else if (lowerArchTeeth.includes(toothNum)) {
                                  productNames.forEach(name => lowerArchProducts.add(name));
                                }
                              });

                              return (
                                <>
                                  {upperArchProducts.size > 0 && (
                                    <div className="flex items-center gap-2 text-sm">
                                      {showProductCheckboxes?.[type] && (
                                        <input
                                          type="checkbox"
                                          className="w-3 h-3 rounded border-gray-300"
                                          checked={
                                            allTeethWithProducts
                                              .filter(t => upperArchTeeth.includes(t.toothNumber || t.teethNumber))
                                              .every(t => selectedTeethForProducts.includes(t.toothNumber || t.teethNumber))
                                          }
                                          onChange={(e) => {
                                            const upperTeeth = allTeethWithProducts
                                              .filter(t => upperArchTeeth.includes(t.toothNumber || t.teethNumber))
                                              .map(t => t.toothNumber || t.teethNumber);

                                            if (e.target.checked) {
                                              setSelectedTeethForProducts(prev => [...new Set([...prev, ...upperTeeth])]);
                                            } else {
                                              setSelectedTeethForProducts(prev => prev.filter(t => !upperTeeth.includes(t)));
                                            }
                                          }}
                                        />
                                      )}
                                      <span>
                                        Upper Arch: {Array.from(upperArchProducts).join(", ")}
                                      </span>
                                    </div>
                                  )}
                                  {lowerArchProducts.size > 0 && (
                                    <div className="flex items-center gap-2 text-sm">
                                      {showProductCheckboxes?.[type] && (
                                        <input
                                          type="checkbox"
                                          className="w-3 h-3 rounded border-gray-300"
                                          checked={
                                            allTeethWithProducts
                                              .filter(t => lowerArchTeeth.includes(t.toothNumber || t.teethNumber))
                                              .every(t => selectedTeethForProducts.includes(t.toothNumber || t.teethNumber))
                                          }
                                          onChange={(e) => {
                                            const lowerTeeth = allTeethWithProducts
                                              .filter(t => lowerArchTeeth.includes(t.toothNumber || t.teethNumber))
                                              .map(t => t.toothNumber || t.teethNumber);

                                            if (e.target.checked) {
                                              setSelectedTeethForProducts(prev => [...new Set([...prev, ...lowerTeeth])]);
                                            } else {
                                              setSelectedTeethForProducts(prev => prev.filter(t => !lowerTeeth.includes(t)));
                                            }
                                          }}
                                        />
                                      )}
                                      <span>
                                        Lower Arch: {Array.from(lowerArchProducts).join(", ")}
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
                              groups.forEach((group: any) => {
                                group.teethDetails
                                  ?.flat()
                                  .forEach((tooth: any) => {
                                    let productNames: string[] = [];
                                    if (
                                      tooth.selectedProducts &&
                                      tooth.selectedProducts.length > 0
                                    ) {
                                      productNames = tooth.selectedProducts.map(
                                        (p: any) => p.name,
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
                                      productNames = [
                                        ...tooth.productDetails.productName,
                                      ];
                                    }
                                    if (productNames.length > 0) {
                                      toothProductList.push({
                                        tooth:
                                          tooth.teethNumber || tooth.toothNumber,
                                        products: productNames,
                                        shadeGuide: tooth.shadeGuide,
                                        shadeNotes: tooth.shadeNotes,
                                        trialRequirements:
                                          tooth.trialRequirements,
                                        occlusalStaining: tooth.occlusalStaining,
                                      });
                                    }
                                  });
                              });
                              toothProductList.sort((a, b) => a.tooth - b.tooth);
                              return toothProductList.map((item, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  {showProductCheckboxes?.[type] && (
                                    <input
                                      type="checkbox"
                                      className="w-3 h-3 rounded border-gray-300"
                                      checked={selectedTeethForProducts.includes(
                                        item.tooth,
                                      )}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedTeethForProducts((prev) => [
                                            ...prev,
                                            item.tooth,
                                          ]);
                                        } else {
                                          setSelectedTeethForProducts((prev) =>
                                            prev.filter((t) => t !== item.tooth),
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
                                const archBasedPrescriptionTypes = [
                                  "splints-guards",
                                  "ortho",
                                  "dentures",
                                  "sleep-accessories"
                                ];

                                const isArchBased = archBasedPrescriptionTypes.includes(
                                  type || formData.prescriptionType || ""
                                );

                                if (isArchBased) {
                                  const upperArchTeeth = [
                                    11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28,
                                  ];
                                  const lowerArchTeeth = [
                                    31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48,
                                  ];

                                  const hasUpperSelected = selectedTeethForProducts.some(tooth =>
                                    upperArchTeeth.includes(tooth)
                                  );
                                  const hasLowerSelected = selectedTeethForProducts.some(tooth =>
                                    lowerArchTeeth.includes(tooth)
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
                                  return `Add product for ${selectedTeethForProducts.length} selected ${selectedTeethForProducts.length === 1 ? "tooth" : "teeth"}`;
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
                          <button
                            type="button"
                            className="ml-2 p-1 text-gray-400 hover:text-blue-600"
                            onClick={() => {
                              setEditField({
                                field: "shadeDetails",
                                groupIdx: idx,
                              });
                              setEditFieldValue(group?.shadeDetails || "");
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </p>
                        <p className="text-gray-600 uppercase">
                          {(() => {
                            // First check group level, then tooth level
                            let shadeDetails = group?.shadeDetails;
                            if (!shadeDetails) {
                              // Check first tooth's shade details
                              const firstTooth = groups.flatMap((g: any) => g.teethDetails?.flat() || [])[0];
                              shadeDetails = firstTooth?.productDetails?.shade || firstTooth?.shadeDetails;
                            }
                            return shadeDetails ? (
                              shadeDetails
                            ) : (
                              <span
                                className="text-blue-600 cursor-pointer"
                                onClick={() => {
                                  setEditField({
                                    field: "shadeDetails",
                                    groupIdx: idx,
                                  });
                                  setEditFieldValue("");
                                }}
                              >
                                Add Shade
                              </span>
                            );
                          })()}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1 flex items-center">
                          {" "}
                          Occlusal Staining:
                          <button
                            type="button"
                            className="ml-2 p-1 text-gray-400 hover:text-blue-600"
                            onClick={() => {
                              setEditField({
                                field: "occlusalStaining",
                                groupIdx: idx,
                              });
                              setEditFieldValue(group?.occlusalStaining || "");
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </p>
                        <p className="text-gray-600 capitalize">
                          {(() => {
                            // First check group level, then tooth level
                            let occlusalStaining = group?.occlusalStaining;
                            if (!occlusalStaining) {
                              // Check first tooth's occlusal staining
                              const firstTooth = groups.flatMap((g: any) => g.teethDetails?.flat() || [])[0];
                              occlusalStaining = firstTooth?.productDetails?.occlusalStaining || firstTooth?.occlusalStaining;
                            }
                            return occlusalStaining ? (
                              occlusalStaining
                            ) : (
                              <span
                                className="text-blue-600 cursor-pointer"
                                onClick={() => {
                                  setEditField({
                                    field: "occlusalStaining",
                                    groupIdx: idx,
                                  });
                                  setEditFieldValue("");
                                }}
                              >
                                Add Occlusal Staining
                              </span>
                            );
                          })()}
                        </p>
                      </div>
                    </div>
                    {/* Notes: show all notes concatenated if present */}
                    {(() => {
                      const notes = groups.flatMap((g: any) =>
                        g.teethDetails
                          ?.flat()
                          .map((t: any) => t.productDetails?.notes)
                          .filter(Boolean),
                      );
                      if (notes.length > 0) {
                        return (
                          <div className="mt-3 text-sm">
                            <p className="font-medium text-gray-900 mb-1 flex items-center">
                              {" "}
                              Notes:
                              <button
                                type="button"
                                className="ml-2 p-1 text-gray-400 hover:text-blue-600"
                                onClick={() => {
                                  setEditField({
                                    field: "shadeNotes",
                                    groupIdx: idx,
                                  });
                                  setEditFieldValue(group?.shadeNotes || "");
                                }}
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            </p>
                            <p className="text-gray-600 italic text-xs leading-relaxed">
                              {notes.join(" | ")}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    })()}
                    {/* Notes: show all notes concatenated if present */}
                    {(() => {
                      const notes = groups.flatMap((g: any) =>
                        g.teethDetails
                          ?.flat()
                          .map((t: any) => t.productDetails?.notes)
                          .filter(Boolean),
                      );
                      if (notes.length > 0) {
                        return (
                          <div className="mt-3 text-sm">
                            <p className="font-medium text-gray-900 mb-1 flex items-center">
                              Notes:
                              <button
                                type="button"
                                className="ml-2 p-1 text-gray-400 hover:text-blue-600"
                                onClick={() => {
                                  setEditField({
                                    field: "shadeNotes",
                                    groupIdx: idx,
                                  });
                                  setEditFieldValue(group?.shadeNotes || "");
                                }}
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            </p>
                            <p className="text-gray-600 italic text-xs leading-relaxed">
                              {notes.join(" | ")}
                            </p>
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
                          if (!shadeGuide || !shadeGuide.type || !shadeGuide.shades || shadeGuide.shades.length === 0) {
                            // Check first tooth's shade guide
                            const firstTooth = groups.flatMap((g: any) => g.teethDetails?.flat() || [])[0];
                            shadeGuide = firstTooth?.shadeGuide;
                          }

                          if (shadeGuide && shadeGuide.type && shadeGuide.shades && shadeGuide.shades.length > 0) {
                            return (
                              <>
                                <p className="font-medium text-gray-900 mb-1 flex items-center">
                                  Shade Guide:
                                  <button
                                    type="button"
                                    className="ml-2 p-1 text-gray-400 hover:text-blue-600"
                                    onClick={() => {
                                      setEditField({
                                        field: "shadeGuide",
                                        groupIdx: idx,
                                      });
                                      setEditFieldValue(shadeGuide);
                                    }}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
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
                                      ),
                                    )}
                                  </div>
                                </div>
                              </>
                            );
                          } else {
                            return (
                              <p className="font-medium text-gray-900 mb-1 flex items-center">
                                Shade Guide:
                                <button
                                  type="button"
                                  className="ml-2 p-1 text-gray-400 hover:text-blue-600"
                                  onClick={() => {
                                    setEditField({
                                      field: "shadeGuide",
                                      groupIdx: idx,
                                    });
                                    setEditFieldValue(null);
                                  }}
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <span
                                  className="text-blue-600 cursor-pointer ml-2"
                                  onClick={() => {
                                    setEditField({
                                      field: "shadeGuide",
                                      groupIdx: idx,
                                    });
                                    setEditFieldValue(null);
                                  }}
                                >
                                  Add Shade Guide
                                </span>
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
                            const firstTooth = groups.flatMap((g: any) => g.teethDetails?.flat() || [])[0];
                            trialRequirements = firstTooth?.trialRequirements;
                          }

                          if (trialRequirements) {
                            return (
                              <>
                                <p className="font-medium text-gray-900 mb-1 flex items-center">
                                  Trial Requirements:
                                  <button
                                    type="button"
                                    className="ml-2 p-1 text-gray-400 hover:text-blue-600"
                                    onClick={() => {
                                      setEditField({
                                        field: "trialRequirements",
                                        groupIdx: idx,
                                      });
                                      setEditFieldValue(trialRequirements);
                                    }}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                </p>
                                <p className="text-gray-600 capitalize">
                                  {trialRequirements}
                                </p>
                              </>
                            );
                          } else {
                            return (
                              <p className="font-medium text-gray-900 mb-1 flex items-center">
                                Trial Requirements:
                                <button
                                  type="button"
                                  className="ml-2 p-1 text-gray-400 hover:text-blue-600"
                                  onClick={() => {
                                    setEditField({
                                      field: "trialRequirements",
                                      groupIdx: idx,
                                    });
                                    setEditFieldValue("");
                                  }}
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <span
                                  className="text-blue-600 cursor-pointer ml-2"
                                  onClick={() => {
                                    setEditField({
                                      field: "trialRequirements",
                                      groupIdx: idx,
                                    });
                                    setEditFieldValue("");
                                  }}
                                >
                                  Add Trial Requirements
                                </span>
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
                          const firstTooth = groups.flatMap((g: any) => g.teethDetails?.flat() || [])[0];
                          shadeNotes = firstTooth?.shadeNotes;
                        }

                        if (shadeNotes) {
                          return (
                            <>
                              <p className="font-medium text-gray-900 mb-1 flex items-center">
                                Shade Notes:
                                <button
                                  type="button"
                                  className="ml-2 p-1 text-gray-400 hover:text-blue-600"
                                  onClick={() => {
                                    setEditField({
                                      field: "shadeNotes",
                                      groupIdx: idx,
                                    });
                                    setEditFieldValue(shadeNotes);
                                  }}
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                              </p>
                              <p className="text-gray-600 capitalize">
                                {shadeNotes}
                              </p>
                            </>
                          );
                        } else {
                          return (
                            <p className="font-medium text-gray-900 mb-1 flex items-center">
                              Shade Notes:
                              <button
                                type="button"
                                className="ml-2 p-1 text-gray-400 hover:text-blue-600"
                                onClick={() => {
                                  setEditField({
                                    field: "shadeNotes",
                                    groupIdx: idx,
                                  });
                                  setEditFieldValue("");
                                }}
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <span
                                className="text-blue-600 cursor-pointer ml-2"
                                onClick={() => {
                                  setEditField({
                                    field: "shadeNotes",
                                    groupIdx: idx,
                                  });
                                  setEditFieldValue("");
                                }}
                              >
                                Add Shade Notes
                              </span>
                            </p>
                          );
                        }
                      })()}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                      <div>
                        <p className="font-medium text-gray-900 mb-1 flex items-center">
                          Pontic Design:
                          <button
                            type="button"
                            className="ml-2 p-1 text-gray-400 hover:text-blue-600"
                            onClick={() => {
                              setEditField({
                                field: "ponticDesign",
                                groupIdx: idx,
                              });
                              setEditFieldValue(group.ponticDesign || "");
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </p>
                        <div className="mt-1">
                          <PonticSelector value={group.ponticDesign} readonly />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
                            ) && !(t.productName && t.productName.length > 0),
                        );
                      return unconfiguredTeeth &&
                        unconfiguredTeeth.length > 0 ? (
                        <div
                          key={index}
                          className={`flex border h-10 py-3 px-5 items-center text-white ${group.groupType === "individual" ? "bg-[#1D4ED8] border-[#4574F9]" : group.groupType === "joint" ? "bg-[#0B8043] border-[#10A457]" : "bg-[#EA580C] border-[#FF7730]"} rounded-lg w-fit capitalize`}
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
                                    n !== undefined && n !== null && n !== "",
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
                                (opt) => opt.label === productDetails.shade[0],
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
                              handleProductDetailsChange("occlusalStaining", value)
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
                                    {productDetails.shadeGuide.type === "anterior"
                                      ? "Anterior"
                                      : "Posterior"}
                                    :
                                  </span>
                                  {productDetails.shadeGuide.shades.map(
                                    (shade, idx) => (
                                      <span key={idx} className="ml-2">
                                        {shade}
                                      </span>
                                    ),
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

      {/* Product Selection Modal */}
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

      {/* Provider Selection Popup
      <BaseModal
        isOpen={showProviderPopup}
        onClose={() => setShowProviderPopup(false)}
        title={`Choose Provider for ${selectedItemType === "retention" ? "Retention Type" : "Abutment Type"}`}
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600 mb-4">
            Who will provide the {selectedItemValue}?
          </p>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => {
                const quantity = editingTeethNumbers.length || 1;
                const newSelection = {
                  value: selectedItemValue,
                  provider: "Provided by Doctor",
                  quantity: quantity,
                };

                setImplantSelections((prev) => ({
                  ...prev,
                  [selectedItemType + "Type"]: newSelection,
                }));

                setFormData({
                  ...formData,
                  [selectedItemType + "Type"]: selectedItemValue,
                });

                setShowProviderPopup(false);
              }}
              className="w-full p-3 border rounded-lg text-left hover:bg-blue-50 transition-colors border-blue-200"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">
                  Provided by Doctor
                </span>
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Doctor
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Doctor will supply the {selectedItemValue}
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                const quantity = editingTeethNumbers.length || 1;
                const newSelection = {
                  value: selectedItemValue,
                  provider: "Provided by Lab",
                  quantity: quantity,
                };

                setImplantSelections((prev) => ({
                  ...prev,
                  [selectedItemType + "Type"]: newSelection,
                }));

                setFormData({
                  ...formData,
                  [selectedItemType + "Type"]: selectedItemValue,
                });

                setShowProviderPopup(false);
              }}
              className="w-full p-3 border rounded-lg text-left hover:bg-green-50 transition-colors border-green-200"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">
                  Provided by Lab
                </span>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  Lab
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Lab will supply the {selectedItemValue}
              </p>
            </button>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setShowProviderPopup(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </BaseModal> */}

      {/* Modal for editing a single field */}
      {/* --- 3. Edit Modal for group-level fields --- */}
      <BaseModal
        isOpen={!!editField}
        onClose={() => setEditField(null)}
        title={`Edit ${editField?.field ? editField.field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()) : ""}`}
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
                      : editFieldValue[0]),
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
              selectedGuide={editFieldValue as ShadeGuide | null}
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
                formData.prescriptionType === "implant"
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
              onClick={() => {
                if (editField) {
                  const updatedTeethGroups = [...formData.toothGroups];
                  // Store at group level
                  updatedTeethGroups[editField.groupIdx] = {
                    ...updatedTeethGroups[editField.groupIdx],
                    [editField.field]: editFieldValue,
                  };
                  // Remove from all teeth in this group
                  updatedTeethGroups[editField.groupIdx].teethDetails =
                    updatedTeethGroups[editField.groupIdx].teethDetails.map(
                      (arr: any) =>
                        (arr as any[]).map((tooth: any) => {
                          const {
                            shadeDetails,
                            shadeGuide,
                            shadeNotes,
                            occlusalStaining,
                            trialRequirements,
                            ponticDesign,
                            ...rest
                          } = tooth;
                          return rest;
                        }),
                    );
                  setFormData({ ...formData, toothGroups: updatedTeethGroups });
                  setEditField(null);
                }
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
};

export default ProductSelection;