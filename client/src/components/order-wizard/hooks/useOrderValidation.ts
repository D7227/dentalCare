import type { OrderCategoryType } from "../types/orderTypes";
import type { OrderType } from "@/types/orderType";
export const useOrderValidation = () => {
  const validateStep = (
    currentStep: number,
    orderCategory: OrderCategoryType,
    order: Partial<OrderType>
  ): string[] => {
    const errors: string[] = [];

    if (orderCategory === "new") {
      switch (currentStep) {
        case 1:
          if (!order.firstName?.trim()) errors.push("First name is required");
          if (!order.lastName?.trim()) errors.push("Last name is required");
          if (!order.caseHandleBy?.trim())
            errors.push("Case handler is required");
          if (!order.orderMethod) errors.push("Please select an order Type");
          break;
        case 2:
          if (
            !order.prescriptionTypesId ||
            order.prescriptionTypesId.length === 0
          )
            errors.push("Please select a prescription type");
          break;
        case 3:
          // Step 3: Subcategory Selection - validate subcategory is selected
          if (order?.prescriptionType && !order?.subcategoryType) {
            // Check if this prescription type requires subcategory selection
            const requiresSubcategory = [
              "fixed-restoration",
              "implant",
              "splints-guards",
              "ortho",
              "dentures",
              "sleep-accessories",
            ].includes(order?.prescriptionType);

            if (requiresSubcategory) {
              errors.push("Please select a subcategory");
            }
          }

          // Subcategory-specific validations
          if (order?.subcategoryType) {
            switch (order?.subcategoryType) {
              case "implant-crown":
              case "implant-bridge":
              case "all-on-4":
              case "all-on-6":
                if (!order?.abutmentType) {
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
          if (
            (!order.teethGroup || order.teethGroup.length === 0) &&
            (!order.selectedTeeth || order.selectedTeeth.length === 0)
          ) {
            errors.push("Please select at least one tooth group");
          }
          // Additional validation: single pontic in bridge group
          const singlePonticBridge = order?.selectedTeeth.find((group: any) => {
            if (group.type === "pontic") {
              return true;
            }
            return false;
          });
          if (singlePonticBridge) {
            errors.push("Single pontic is not allowed make a bridge group.");
          }
          break;
        case 5:
          // Step 5: Product Selection - validate that products are configured
          const productToothGroups = order?.teethGroup || [];
          const individualTeeth = order?.selectedTeeth || [];

          // Check if we have either tooth groups or individual teeth
          if (productToothGroups.length === 0 && individualTeeth.length === 0) {
            errors.push("At least one restoration product group is required");
          } else {
            // Validate tooth groups have required product details
            const incompleteGroups = productToothGroups.filter((group: any) => {
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
          if (order?.orderType === "request-scan") {
            if (!order?.scanBooking?.areaManagerId?.trim())
              errors.push("Area manager is required for scan booking");
            if (!order?.scanBooking?.scanDate?.trim())
              errors.push("Scan date is required for scan booking");
            if (!order?.scanBooking?.scanTime?.trim())
              errors.push("Scan time is required for scan booking");
          }
          break;
        case 7:
          // Step 7: Final Details & Accessories
          const accessories = order?.accessories || [];
          if (
            accessories.includes("other") &&
            (!order?.otherAccessory || order?.otherAccessory.trim() === "")
          ) {
            errors.push("Please specify the other accessory");
          }
          break;
      }
    }
    if (orderCategory === "repeat") {
      switch (currentStep) {
        case 1:
          if (
            !("previousOrderId" in order) ||
            !order.previousOrderId?.toString().trim()
          )
            errors.push("Please select a previous order");
          break;
        case 3:
          if (order?.orderType === "request-scan") {
            if (!order?.scanBooking?.areaManagerId?.trim())
              errors.push("Area manager is required for scan booking");
            if (!order?.scanBooking?.scanDate?.trim())
              errors.push("Scan date is required for scan booking");
            if (!order?.scanBooking?.scanTime?.trim())
              errors.push("Scan time is required for scan booking");
          }
          const accessories = order?.accessories || [];
          if (
            accessories.includes("other") &&
            (!order?.otherAccessory || order?.otherAccessory.trim() === "")
          ) {
            errors.push("Please specify the other accessory");
          }
          break;
      }
    }
    if (orderCategory === "repair") {
      switch (currentStep) {
        case 1:
          if (
            !("repairOrderId" in order) ||
            !order.repairOrderId?.toString().trim()
          )
            errors.push("Please select an order to repair");
          break;
        case 2:
          if (!order?.issueDescription.trim())
            errors.push("Please describe the issue");
          break;
        case 3:
          if (!order?.repairType.trim())
            errors.push("Please select a repair type");
          break;
        case 4:
          if (order?.orderType === "request-scan") {
            if (!order?.scanBooking?.areaManagerId?.trim())
              errors.push("Area manager is required for scan booking");
            if (!order?.scanBooking?.scanDate?.trim())
              errors.push("Scan date is required for scan booking");
            if (!order?.scanBooking?.scanTime?.trim())
              errors.push("Scan time is required for scan booking");
          }
          const repairAccessories = order?.accessories || [];
          if (
            repairAccessories.includes("other") &&
            (!order?.otherAccessory || order?.otherAccessory.trim() === "")
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
