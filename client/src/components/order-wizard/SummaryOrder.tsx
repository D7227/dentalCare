import React from "react";
import PatientInfoCard from "./components/PatientInfoCard";
import CaseInfoCard from "./components/CaseInfoCard";
import OrderTypeSection from "./components/OrderTypeSection";
import UploadFileSection from "./components/UploadFileSection";
import AccessorySelection from "./components/AccessorySelection";
import ProductCard from "./components/ProductCard";
import ToothSelector from "./ToothSelector";

interface AccessoryTaggingProps {
  formData: any;
  setFormData: (data: any) => void;
  readMode?: boolean;
  editMode?: boolean;
  download?: boolean;
}

const SummaryOrder = ({
  formData,
  setFormData,
  readMode = false,
  editMode = false,
  download = false,
}: AccessoryTaggingProps) => {
  console.log("formData", formData);
  const getAllGroups = () => {
    const teethGroup = formData.teethGroup || [];
    const groupedTeeth = new Set(
      teethGroup.flatMap(
        (g: any) => g.teethDetails?.flat().map((t: any) => t.teethNumber) || []
      )
    );
    const individualTeeth = (formData.selectedTeeth || [])
      .map((t: any) => ({
        ...t,
        selectedProducts: t.selectedProducts || [],
        productDetails: t.productDetails || {},
      }))
      .filter((t: any) => !groupedTeeth.has(t.teethNumber));

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

    let allGroups = [...teethGroup];

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

    if (!result) {
      console.log("Unconfigured group:", group, "teeth:", allTeeth);
    }
    return result;
  };
  return (
    <>
      <div className="md:flex item-start gap-2">
        <div className="w-full md:w-[50%] flex flex-col gap-2">
          <ToothSelector
            prescriptionType={formData?.prescriptionType}
            selectedGroups={formData?.teethGroup || []}
            selectedTeeth={formData?.selectedTeeth || []}
            onSelectionChange={(groups, teeth) =>
              setFormData({
                ...formData,
                teethGroup: groups,
                selectedTeeth: teeth,
              })
            }
            formData={formData}
            readMode={readMode}
          />

          <AccessorySelection
            formData={formData}
            setFormData={setFormData}
            readMode={readMode}
            editMode={editMode}
          />
        </div>
        <div className="w-full md:w-[50%] flex flex-col gap-2 mt-2 md:mt-0">
          <PatientInfoCard
            formData={formData}
            setFormData={setFormData}
            readMode={readMode}
            editMode={editMode}
          />
          <CaseInfoCard
            formData={formData}
            setFormData={setFormData}
            readMode={readMode}
            editMode={editMode}
          />

          <OrderTypeSection
            formData={formData}
            setFormData={setFormData}
            readMode={readMode}
            editMode={editMode}
          />

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
                <ProductCard
                  type={type}
                  groups={groups}
                  allGroups={allGroups}
                  formData={formData}
                  groupIdx={idx}
                  onSaveGroupFields={(groupIdx, field, value) => {
                    // Update formData in parent
                    const updatedGroups = [...formData.teethGroup];
                    updatedGroups[groupIdx] = {
                      ...updatedGroups[groupIdx],
                      [field]: value,
                    };
                    setFormData({ ...formData, teethGroup: updatedGroups });
                  }}
                  setFormData={setFormData}
                  readMode={readMode}
                />
              );
            })}
        </div>
      </div>
      <div className="mt-2">
        <UploadFileSection
          formData={formData}
          setFormData={setFormData}
          readMode={readMode}
          download={download}
        />
      </div>
    </>
  );
};

export default SummaryOrder;
