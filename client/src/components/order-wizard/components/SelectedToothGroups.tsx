import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Edit } from 'lucide-react';
import { ToothGroup } from '../types/tooth';
import ToothModificationDialog from './ToothModificationDialog.tsx';

interface SelectedTooth {
  toothNumber: number;
  type: 'abutment' | 'pontic';
}

interface SelectedToothGroupsProps {
  selectedGroups: ToothGroup[];
  selectedTeeth: SelectedTooth[];
  onRemoveGroup: (groupId: string) => void;
  onRemoveTooth: (toothNumber: number) => void;
  onUpdateGroup?: (groupId: string, updatedGroup: ToothGroup) => void;
  onUpdateTooth?: (toothNumber: number, newType: 'abutment' | 'pontic') => void;
  onAddIndividualTooth?: (toothNumber: number, type: 'abutment' | 'pontic') => void;
}

const SelectedToothGroups = ({ 
  selectedGroups, 
  selectedTeeth, 
  onRemoveGroup, 
  onRemoveTooth,
  onUpdateGroup,
  onUpdateTooth,
  onAddIndividualTooth
}: SelectedToothGroupsProps) => {
  const [showModificationDialog, setShowModificationDialog] = useState(false);
  const [selectedToothForEdit, setSelectedToothForEdit] = useState<number | null>(null);
  const [selectedGroupForEdit, setSelectedGroupForEdit] = useState<ToothGroup | null>(null);

  const handleEditTooth = (toothNumber: number, group?: ToothGroup) => {
    console.log('Edit tooth clicked:', toothNumber, 'group:', group);
    setSelectedToothForEdit(toothNumber);
    setSelectedGroupForEdit(group || null);
    setShowModificationDialog(true);
  };

  const handleMakeAbutment = () => {
    if (selectedToothForEdit && selectedGroupForEdit && onUpdateGroup) {
      console.log('Making abutment for tooth:', selectedToothForEdit);
      const updatedGroup = {
        ...selectedGroupForEdit,
        pontics: selectedGroupForEdit.pontics?.filter(p => p !== selectedToothForEdit) || []
      };
      onUpdateGroup(selectedGroupForEdit.groupId, updatedGroup);
    }
    setShowModificationDialog(false);
  };

  const handleMakePontic = () => {
    if (selectedToothForEdit && selectedGroupForEdit && onUpdateGroup) {
      console.log('Making pontic for tooth:', selectedToothForEdit);
      const updatedGroup = {
        ...selectedGroupForEdit,
        pontics: [...(selectedGroupForEdit.pontics || []), selectedToothForEdit],
        type: 'bridge' as const
      };
      onUpdateGroup(selectedGroupForEdit.groupId, updatedGroup);
    }
    setShowModificationDialog(false);
  };

  const handleRemoveFromGroup = () => {
    if (selectedToothForEdit && selectedGroupForEdit) {
      console.log('Removing tooth from group:', selectedToothForEdit, selectedGroupForEdit);
      if (selectedGroupForEdit.teeth.length === 1) {
        // If only one tooth left, remove entire group
        onRemoveGroup(selectedGroupForEdit.groupId);
      } else if (onUpdateGroup) {
        // Remove tooth from group
        const updatedGroup = {
          ...selectedGroupForEdit,
          teeth: selectedGroupForEdit.teeth.filter(t => t !== selectedToothForEdit),
          pontics: selectedGroupForEdit.pontics?.filter(p => p !== selectedToothForEdit) || []
        };
        onUpdateGroup(selectedGroupForEdit.groupId, updatedGroup);
      }
    }
    setShowModificationDialog(false);
  };

  const handleSplitGroup = () => {
    if (selectedToothForEdit && selectedGroupForEdit && onUpdateGroup) {
      console.log('Splitting group - removing tooth:', selectedToothForEdit, 'from group:', selectedGroupForEdit);
      
      // Create individual tooth from the one being split
      const toothType = selectedGroupForEdit.pontics?.includes(selectedToothForEdit) ? 'pontic' : 'abutment';
      
      // Add the split tooth as individual tooth
      if (onAddIndividualTooth) {
        onAddIndividualTooth(selectedToothForEdit, toothType);
      }
      
      // Remove tooth from the group
      if (selectedGroupForEdit.teeth.length === 1) {
        // If only one tooth left, remove entire group
        onRemoveGroup(selectedGroupForEdit.groupId);
      } else {
        // Update the group to remove this tooth
        const updatedGroup = {
          ...selectedGroupForEdit,
          teeth: selectedGroupForEdit.teeth.filter(t => t !== selectedToothForEdit),
          pontics: selectedGroupForEdit.pontics?.filter(p => p !== selectedToothForEdit) || []
        };
        onUpdateGroup(selectedGroupForEdit.groupId, updatedGroup);
      }
    }
    setShowModificationDialog(false);
  };

  if (selectedGroups.length === 0 && selectedTeeth.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <p className="text-sm text-gray-500">No teeth selected</p>
        <p className="text-xs text-gray-400 mt-1">Click on teeth to start selecting</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
        📋 Selected Teeth
      </h4>

      {/* Individual Teeth */}
      {selectedTeeth.length > 0 && (
        <Card className="border border-blue-200 bg-blue-50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800">Individual Teeth</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedTeeth.map(tooth => (
                <div
                  key={tooth.toothNumber}
                  className="flex items-center gap-1 px-2 py-1 bg-white rounded-full border border-blue-200"
                >
                  <span className="text-xs font-medium">
                    {tooth.toothNumber} ({tooth.type === 'abutment' ? 'A' : 'P'})
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditTooth(tooth.toothNumber)}
                    className="h-4 w-4 p-0 hover:bg-blue-100 mr-1"
                  >
                    <Edit size={8} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveTooth(tooth.toothNumber)}
                    className="h-4 w-4 p-0 hover:bg-red-100"
                  >
                    <X size={10} />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Groups */}
      {selectedGroups.map(group => {
        const bgColor = group.type === 'joint' ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200';
        const textColor = group.type === 'joint' ? 'text-green-800' : 'text-orange-800';
        const icon = group.type === 'joint' ? '🔗' : '🌉';

        return (
          <Card key={group.groupId} className={`border ${bgColor}`}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${textColor} flex items-center gap-1`}>
                  {icon} {group.type === 'joint' ? 'Joint' : 'Bridge'} Group
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveGroup(group.groupId)}
                  className="h-6 w-6 p-0 hover:bg-red-100"
                >
                  <X size={12} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.teeth.map(toothNumber => {
                  const isPontic = group.pontics?.includes(toothNumber);
                  return (
                    <div
                      key={toothNumber}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        isPontic 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <span>{toothNumber} {isPontic ? '(P)' : '(A)'}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTooth(toothNumber, group)}
                        className="h-3 w-3 p-0 hover:bg-gray-100 mr-1"
                      >
                        <Edit size={8} />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Tooth Modification Dialog */}
      <ToothModificationDialog
        isOpen={showModificationDialog}
        onClose={() => setShowModificationDialog(false)}
        clickedTooth={selectedToothForEdit || 0}
        currentGroup={selectedGroupForEdit}
        onMakeAbutment={handleMakeAbutment}
        onMakePontic={handleMakePontic}
        onRemoveTooth={handleRemoveFromGroup}
        onSplitGroup={handleSplitGroup}
      />
    </div>
  );
};

export default SelectedToothGroups;
