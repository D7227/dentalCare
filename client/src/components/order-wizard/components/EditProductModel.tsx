import BaseModal from '@/components/shared/BaseModal';
import React from 'react'
import ShadeSelector, { shadeOptions } from '../ShadeSelector';
import ShadeGuideSection from './ShadeGuideSection';
import PonticSelector from './ponticSelector';
import { FormData, ShadeGuide } from '../types/orderTypes';
import FormField from '@/components/shared/FormField';
import TrialSelector from './TrialSelector';
import { Button } from '@/components/ui/button';

interface EditProductModelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  editField: any;
  setEditField: any;
  editFieldValue: any;
  setEditFieldValue: any;
  formData: FormData;
  setFormData: any
}

const EditProductModel = (
  { isOpen,
    onClose,
    title,
    editField,
    setEditField,
    editFieldValue,
    setEditFieldValue,
    formData,
    setFormData }: EditProductModelProps
) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
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
  )
}

export default EditProductModel