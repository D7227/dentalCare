import { OrderCategory, FormData } from "../types/orderTypes";
export const useOrderValidation = () => {
  const validateStep = (
    currentStep: number,
    orderCategory: OrderCategory,
    formData: FormData,
  ): string[] => {
    const errors: string[] = [];
    if (orderCategory === "new") {
      switch (currentStep) {
        case 1:
          if (!formData.firstName.trim()) errors.push("First name is required");
          if (!formData.lastName.trim()) errors.push("Last name is required");
          if (!formData.caseHandleBy.trim())
            errors.push("Case handler is required");
          if (!formData.orderMethod)
            errors.push("Please select an order Type");
          break;
        case 2:
          // Step 2: Restoration Type - validate prescription type and order method
          if (!formData.prescriptionType)
            errors.push("Please select a prescription type");
          break;
        case 3:
          // Step 3: Subcategory Selection - validate subcategory is selected
          if (formData.prescriptionType && !formData.subcategoryType) {
            // Check if this prescription type requires subcategory selection
            const requiresSubcategory = [
              "fixed-restoration",
              "implant",
              "splints-guards",
              "ortho",
              "dentures",
              "sleep-accessories"
            ].includes(formData.prescriptionType);

            if (requiresSubcategory) {
              errors.push("Please select a subcategory");
            }
          }

          // Subcategory-specific validations
          if (formData.subcategoryType) {
            switch (formData.subcategoryType) {
              case "implant-crown":
              case "implant-bridge":
              case "all-on-4":
              case "all-on-6":
                if (!formData.abutmentType) {
                  errors.push(
                    "Please select an abutment type for implant orders"
                  );
                }
                break;
              case "full-dentures":
              case "partial-dentures":
                // Denture-specific validations can be added here
                break;
              case "night-guard":
              case "sports-guard":
              case "tmj-splint":
                // Splint-specific validations can be added here
                break;
            }
          }
          break;
        case 4:
          // Step 4: Teeth Selection - validate that teeth are selected
          const teethGroups = formData.teethGroups || [];
          const selectedTeeth = (formData as any).selectedTeeth || [];
          if (teethGroups.length === 0 && selectedTeeth.length === 0) {
            errors.push("Please select at least one tooth group");
          }
          // Additional validation: single pontic in bridge group
          const singlePonticBridge = formData?.selectedTeeth.find(
            (group: any) => {
              if (group.type === "pontic") {
                return true;
              }
              return false;
            },
          );
          if (singlePonticBridge) {
            errors.push("Single pontic is not allowed make a bridge group.");
          }
          break;
        case 5:
          // Step 5: Product Selection - validate that products are configured
          const productteethGroups = formData.teethGroups || [];
          const individualTeeth = formData.selectedTeeth || [];

          // Check if we have either tooth groups or individual teeth
          if (productteethGroups.length === 0 && individualTeeth.length === 0) {
            errors.push("At least one restoration product group is required");
          } else {
            // Validate tooth groups have required product details
            const incompleteGroups = productteethGroups.filter((group: any) => {
              const allTeeth = group.teethDetails?.flat() || [];
              return (
                allTeeth.length === 0 ||
                !allTeeth.every(
                  (t: any) =>
                    (t.selectedProducts && t.selectedProducts.length > 0) ||
                    (t.productName && t.productName.length > 0)
                )
              );
            });

            // Validate individual teeth have products selected
            const incompleteIndividualTeeth = individualTeeth.filter(
              (tooth: any) => {
                return (
                  (!tooth.selectedProducts ||
                    tooth.selectedProducts.length === 0) &&
                  (!tooth.productName || tooth.productName.length === 0)
                );
              }
            );

            if (incompleteGroups.length > 0) {
              errors.push(
                "Please complete product selection for all tooth groups"
              );
            }
            if (incompleteIndividualTeeth.length > 0) {
              errors.push(
                "Please complete product selection for all individual teeth"
              );
            }
          }
          break;
        case 6:
          // Step 6: Upload & Logistics
          if (formData.orderType === "request-scan") {
            if (!formData.scanBooking?.areaManagerId?.trim())
              errors.push("Area manager is required for scan booking");
            if (!formData.scanBooking?.scanDate?.trim())
              errors.push("Scan date is required for scan booking");
            if (!formData.scanBooking?.scanTime?.trim())
              errors.push("Scan time is required for scan booking");
          }
          break;
        case 7:
          // Step 7: Final Details & Accessories
          const accessories = formData.accessories || [];
          if (
            accessories.includes("other") &&
            (!formData.otherAccessory || formData.otherAccessory.trim() === "")
          ) {
            errors.push("Please specify the other accessory");
          }
          break;
      }
    }
    if (orderCategory === "repeat") {
      switch (currentStep) {
        case 1:
          if (!formData.previousOrderId.trim())
            errors.push("Please select a previous order");
          break;
        case 3:
          if (formData.orderType === "request-scan") {
            if (!formData.scanBooking?.areaManagerId?.trim())
              errors.push("Area manager is required for scan booking");
            if (!formData.scanBooking?.scanDate?.trim())
              errors.push("Scan date is required for scan booking");
            if (!formData.scanBooking?.scanTime?.trim())
              errors.push("Scan time is required for scan booking");
          }
          const accessories = formData.accessories || [];
          if (
            accessories.includes("other") &&
            (!formData.otherAccessory || formData.otherAccessory.trim() === "")
          ) {
            errors.push("Please specify the other accessory");
          }
          break;
      }
    }
    if (orderCategory === "repair") {
      switch (currentStep) {
        case 1:
          if (!formData.repairOrderId.trim())
            errors.push("Please select an order to repair");
          break;
        case 2:
          if (!formData.issueDescription.trim())
            errors.push("Please describe the issue");
          break;
        case 3:
          if (!formData.repairType.trim())
            errors.push("Please select a repair type");
          break;
        case 4:
          if (formData.orderType === "request-scan") {
            if (!formData.scanBooking?.areaManagerId?.trim())
              errors.push("Area manager is required for scan booking");
            if (!formData.scanBooking?.scanDate?.trim())
              errors.push("Scan date is required for scan booking");
            if (!formData.scanBooking?.scanTime?.trim())
              errors.push("Scan time is required for scan booking");
          }
          const repairAccessories = formData.accessories || [];
          if (
            repairAccessories.includes("other") &&
            (!formData.otherAccessory || formData.otherAccessory.trim() === "")
          ) {
            errors.push("Please specify the other accessory");
          }
          break;
      }
    }
    return errors;
  };
  return { validateStep };
};
