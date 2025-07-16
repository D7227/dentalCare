import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import PatientInfoCard from "./components/PatientInfoCard";
import CaseInfoCard from "./components/CaseInfoCard";
import OrderTypeSection from "./components/OrderTypeSection";
import { SelectPrescriptionSection } from "./components/SelectPrescriptionSection";
import UploadFileSection from "./components/UploadFileSection";
import AccessorySelection from "./components/AccessorySelection";
import ProductCard from "./components/ProductCard";
import ToothSelector from "./ToothSelector";

interface AccessoryTaggingProps {
  formData: any;
  setFormData: (data: any) => void;
}

const SummaryOrder = ({ formData, setFormData }: AccessoryTaggingProps) => {
  console.log("formData", formData);
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
  return (
    <>
      {/* <h1>doctorrrrrrrrrrrrrrrrrrrrrrrrr</h1> */}
      <PatientInfoCard
        formData={formData}
        setFormData={setFormData}
        render={true}
      />
      <CaseInfoCard
        formData={formData}
        setFormData={setFormData}
        render={true}
      />
      <OrderTypeSection
        formData={formData}
        setFormData={setFormData}
        render={true}
      />
      <ToothSelector
        prescriptionType={formData?.prescriptionType}
        selectedGroups={formData?.teethGroups || []}
        selectedTeeth={formData?.selectedTeeth || []}
        onSelectionChange={(groups, teeth) =>
          setFormData({
            ...formData,
            teethGroups: groups,
            selectedTeeth: teeth,
          })
        }
        subcategoryType={formData?.subcategoryType}
        formData={formData}
        readMode={true}
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
                const updatedGroups = [...formData.teethGroups];
                updatedGroups[groupIdx] = {
                  ...updatedGroups[groupIdx],
                  [field]: value,
                };
                setFormData({ ...formData, teethGroups: updatedGroups });
              }}
              setFormData={setFormData}
              readMode={true}
            />
          );
        })}
      <UploadFileSection
        formData={formData}
        setFormData={setFormData}
        readMode={true}
      />
      <AccessorySelection
        formData={formData}
        setFormData={setFormData}
        readMode={true}
      />

      {/* <p>QAAAAAAAAAAAAAAAAAAAAAAAAAAAA</p>
      <PatientInfoCard
        formData={formData}
        setFormData={setFormData}
        render={true}
        editing={true}
      />
      <CaseInfoCard
        formData={formData}
        setFormData={setFormData}
        render={true}
        editing={true}
      />
      <OrderTypeSection
        formData={formData}
        setFormData={setFormData}
        render={true}
        editing={true}
      />
      <ToothSelector
        prescriptionType={formData?.prescriptionType}
        selectedGroups={formData?.teethGroups || []}
        selectedTeeth={formData?.selectedTeeth || []}
        onSelectionChange={(groups, teeth) =>
          setFormData({
            ...formData,
            teethGroups: groups,
            selectedTeeth: teeth,
          })
        }
        subcategoryType={formData?.subcategoryType}
        formData={formData}
        readMode={true}
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
                const updatedGroups = [...formData.teethGroups];
                updatedGroups[groupIdx] = {
                  ...updatedGroups[groupIdx],
                  [field]: value,
                };
                setFormData({ ...formData, teethGroups: updatedGroups });
              }}
              setFormData={setFormData}
            />
          );
        })}
      <UploadFileSection
        formData={formData}
        setFormData={setFormData}
        readMode={true}
        download={true}
      />
      <AccessorySelection
        formData={formData}
        setFormData={setFormData}
        readMode={true}
        editMode={true}
      /> */}
    </>
  );
};

export default SummaryOrder;
