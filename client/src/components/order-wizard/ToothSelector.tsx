import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ToothChart from './components/ToothChart';
import SelectedToothGroups from './components/SelectedToothGroups';
import ToothTypeDialog from './components/ToothTypeDialog';
import { ToothGroup } from './types/tooth';
import { CrownBridgeTeeth, ImpantTeeth } from '@/assets/svg';
import RadioCardGroup from '../common/RadioCardGroup';

interface ToothSelectorProps {
  prescriptionType: 'implant' | 'crown-bridge';
  selectedGroups: ToothGroup[];
  selectedTeeth: SelectedTooth[];
  onGroupsChange?: (groups: ToothGroup[]) => void;
  onSelectionChange: (groups: ToothGroup[], teeth: SelectedTooth[]) => void;
  onProductComplete?: () => void;
}
interface SelectedTooth {
  prescriptionType: 'implant' | 'crown-bridge';
  toothNumber: number;
  type: 'abutment' | 'pontic';
}
const ToothSelector = ({  
  prescriptionType,
  selectedGroups,
  selectedTeeth,
  onGroupsChange,
  onSelectionChange,
  onProductComplete
}: ToothSelectorProps) => {
  const [productSelection, setProductSelection] = useState<'implant' | 'crown-bridge' | null>(null);
  const [localSelectedTeeth, setLocalSelectedTeeth] = useState<SelectedTooth[]>(selectedTeeth || []);
  const [localSelectedGroups, setLocalSelectedGroups] = useState<ToothGroup[]>(selectedGroups || []);
  const [showTypeDialog, setShowTypeDialog] = useState(false);
  const [dialogPosition, setDialogPosition] = useState({
    x: 0,
    y: 0
  });
  const [clickedTooth, setClickedTooth] = useState<number | null>(null);
  const [deliveryType, setDeliveryType] = useState<'digital' | 'manual' | null>(null);

  useEffect(() => {
    setLocalSelectedTeeth(selectedTeeth || []);
  }, [selectedTeeth]);
  useEffect(() => {
    setLocalSelectedGroups(selectedGroups || []);
  }, [selectedGroups]);

  const updateSelection = (groups: ToothGroup[], teeth: SelectedTooth[]) => {
    setLocalSelectedGroups(groups);
    setLocalSelectedTeeth(teeth);
    onSelectionChange(groups, teeth);
    if (onGroupsChange) onGroupsChange(groups);
  };

  const isToothSelected = useCallback((toothNumber: number) => {
    return localSelectedTeeth.some(tooth => tooth.toothNumber === toothNumber) || localSelectedGroups.some(group => group.teeth.includes(toothNumber));
  }, [localSelectedTeeth, localSelectedGroups]);

  const getToothType = useCallback((toothNumber: number): 'abutment' | 'pontic' | null => {
    const selectedTooth = localSelectedTeeth.find(tooth => tooth.toothNumber === toothNumber);
    if (selectedTooth) {
      return selectedTooth.type;
    }
    for (const group of localSelectedGroups) {
      if (group.teeth.includes(toothNumber)) {
        if (group.pontics && group.pontics.includes(toothNumber)) {
          return 'pontic';
        }
        return 'abutment';
      }
    }
    return null;
  }, [localSelectedTeeth, localSelectedGroups]);

  const areTeethStrictlyAdjacent = (tooth1: number, tooth2: number): boolean => {
    console.log('Checking strict adjacency between', tooth1, 'and', tooth2);

    const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
    const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
    const lowerLeft = [31, 32, 33, 34, 35, 36, 37, 38];
    const lowerRight = [41, 42, 43, 44, 45, 46, 47, 48];

    const checkQuadrantAdjacency = (quadrant: number[]) => {
      const index1 = quadrant.indexOf(tooth1);
      const index2 = quadrant.indexOf(tooth2);
      if (index1 !== -1 && index2 !== -1) {
        return Math.abs(index1 - index2) === 1;
      }
      return false;
    };

    if (checkQuadrantAdjacency(upperRight)) return true;
    if (checkQuadrantAdjacency(upperLeft)) return true;
    if (checkQuadrantAdjacency(lowerLeft)) return true;
    if (checkQuadrantAdjacency(lowerRight)) return true;

    if ((tooth1 === 11 && tooth2 === 21) || (tooth1 === 21 && tooth2 === 11)) return true;
    if (tooth1 === 31 && tooth2 === 41 || tooth1 === 41 && tooth2 === 31) return true;
    console.log('Teeth', tooth1, 'and', tooth2, 'are NOT strictly adjacent');
    return false;
  };

  const validateTeethSequence = (teeth: number[]): boolean => {
    if (teeth.length < 2) return true;
    for (let i = 0; i < teeth.length - 1; i++) {
      if (!areTeethStrictlyAdjacent(teeth[i], teeth[i + 1])) {
        console.log('Invalid sequence: gap between', teeth[i], 'and', teeth[i + 1]);
        return false;
      }
    }
    console.log('Sequence is valid');
    return true;
  };

  const handleToothClick = (toothNumber: number, event: React.MouseEvent) => {
    const rect = (event.target as Element).getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    if (isToothSelected(toothNumber)) {
      handleToothDeselection(toothNumber);
      return;
    }

    setClickedTooth(toothNumber);
    setDialogPosition(position);
    setShowTypeDialog(true);
  };

  const handleToothDeselection = (toothNumber: number) => {
    console.log('Deselecting tooth:', toothNumber);

    const groupContainingTooth = localSelectedGroups.find(g => g.teeth.includes(toothNumber));
    if (groupContainingTooth) {
      console.log('Tooth is in group:', groupContainingTooth.groupId);
      if (groupContainingTooth.teeth.length === 1) {
        console.log('Removing entire group');
        updateSelection(localSelectedGroups.filter(g => g.groupId !== groupContainingTooth.groupId), localSelectedTeeth.filter(t => t.toothNumber !== toothNumber));
      } else if (groupContainingTooth.teeth.length === 2) {
        const remainingTooth = groupContainingTooth.teeth.find(t => t !== toothNumber);
        if (remainingTooth) {
          console.log('Converting remaining tooth to individual:', remainingTooth);
          const remainingToothType = 'abutment';

          updateSelection(localSelectedGroups.filter(g => g.groupId !== groupContainingTooth.groupId), localSelectedTeeth.filter(t => t.toothNumber !== toothNumber).concat({
            toothNumber: remainingTooth,
            type: remainingToothType,
            prescriptionType
          }));
        }
      } else {
        const updatedTeeth = groupContainingTooth.teeth.filter(t => t !== toothNumber);

        if (validateTeethSequence(updatedTeeth)) {
          console.log('Updating group with remaining connected teeth');
          const updatedGroup = {
            ...groupContainingTooth,
            teeth: updatedTeeth,
            pontics: groupContainingTooth.pontics ? groupContainingTooth.pontics.filter((p: number) => updatedTeeth.includes(p)) : [],
          };
          updateSelection(localSelectedGroups.map(g => g.groupId === groupContainingTooth.groupId ? updatedGroup : g), localSelectedTeeth.filter(t => !updatedTeeth.includes(t.toothNumber)));
        } else {
          console.log('Splitting into valid adjacent fragments');
          const fragments = findValidAdjacentFragments(updatedTeeth);
          const remainingGroups = localSelectedGroups.filter(g => g.groupId !== groupContainingTooth.groupId);
          const newGroups = [...remainingGroups];
          const newIndividualTeeth = [...localSelectedTeeth.filter(t => !updatedTeeth.includes(t.toothNumber))];
          fragments.forEach((fragment, index) => {
            if (fragment.length === 1) {
              const toothNum = fragment[0];
              const wasPontic = groupContainingTooth.pontics?.includes(toothNum);
              const type = wasPontic ? 'pontic' : 'abutment';
              newIndividualTeeth.push({
                toothNumber: toothNum,
                type,
                prescriptionType
              });
            } else {
              const pontics = groupContainingTooth.pontics ? groupContainingTooth.pontics.filter((p: number) => fragment.includes(p)) : [];
              const newGroup: ToothGroup = {
                groupId: `group-${Date.now()}-${index}`,
                teeth: fragment,
                type: pontics.length > 0 ? 'bridge' : 'joint',
                notes: groupContainingTooth.notes,
                material: groupContainingTooth.material,
                shade: groupContainingTooth.shade,
                productType: 'implant',
                pontics,
              };
              newGroups.push(newGroup);
            }
          });
          updateSelection(newGroups, newIndividualTeeth);
        }
      }
    } else {
      console.log('Removing individual tooth');
      updateSelection(localSelectedGroups, localSelectedTeeth.filter(t => t.toothNumber !== toothNumber));
    }
  };

  const findValidAdjacentFragments = (teeth: number[]): number[][] => {
    if (teeth.length === 0) return [];
    const upperArch = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
    const lowerArch = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
    const isUpper = teeth.every(t => upperArch.includes(t));
    const isLower = teeth.every(t => lowerArch.includes(t));
    const arch = isUpper ? upperArch : isLower ? lowerArch : null;
    const sortedTeeth = arch
      ? teeth.slice().sort((a, b) => arch.indexOf(a) - arch.indexOf(b))
      : teeth.slice().sort((a, b) => a - b);
    const fragments: number[][] = [];
    let currentFragment = [sortedTeeth[0]];
    for (let i = 1; i < sortedTeeth.length; i++) {
      const currentTooth = sortedTeeth[i];
      const previousTooth = sortedTeeth[i - 1];
      if (areTeethStrictlyAdjacent(previousTooth, currentTooth)) {
        currentFragment.push(currentTooth);
      } else {
        fragments.push(currentFragment);
        currentFragment = [currentTooth];
      }
    }
    fragments.push(currentFragment);
    return fragments;
  };

  const handleToothTypeSelection = (type: 'abutment' | 'pontic') => {
    if (clickedTooth === null) return;
    updateSelection(localSelectedGroups, localSelectedTeeth.concat({
      toothNumber: clickedTooth,
      type,
      prescriptionType
    }));
    setShowTypeDialog(false);
    setClickedTooth(null);
  };

  const handleJoinGroup = (toothNumber: number, groupId: string) => {
    console.log('Joining tooth', toothNumber, 'to group', groupId);

    const targetGroup = localSelectedGroups.find(g => g.groupId === groupId);
    if (!targetGroup) return;

    const updatedGroup = {
      ...targetGroup,
      teeth: [...targetGroup.teeth, toothNumber].sort((a, b) => a - b)
    };

    updateSelection(localSelectedGroups.map(g => g.groupId === groupId ? updatedGroup : g), localSelectedTeeth);

    setShowTypeDialog(false);
    setClickedTooth(null);
  };

  const handleDragConnection = (teeth: number[] | number, splitData?: any) => {
    if (typeof teeth === 'number') {
      if (teeth === -3) {
        if (splitData?.groupToRemove) {
          const group = splitData.groupToRemove;
          console.log('Removing 2-tooth group:', group.groupId);

          const updatedGroups = localSelectedGroups.filter(g => g.groupId !== group.groupId);
          updateSelection(updatedGroups, localSelectedTeeth.filter(t => !group.teeth.includes(t.toothNumber)));
        }
        return;
      }
      if (teeth === -4) {
        if (splitData?.originalGroup && splitData?.newGroups) {
          const {
            originalGroup,
            newGroups
          } = splitData;
          console.log('Splitting group:', originalGroup.groupId, 'into:', newGroups.length, 'groups');

          const updatedGroups = localSelectedGroups.filter(g => g.groupId !== originalGroup.groupId);
          const finalGroups = [...updatedGroups];
          const newIndividualTeeth = [...localSelectedTeeth.filter(t => !originalGroup.teeth.includes(t.toothNumber))];
          newGroups.forEach((group: ToothGroup) => {
            if (group.teeth.length === 1) {
              const toothNumber = group.teeth[0];
              const wasPontic = group.pontics?.includes(toothNumber);
              const type = wasPontic ? 'pontic' : 'abutment';
              const exists = localSelectedTeeth.some(t => t.toothNumber === toothNumber);
              if (!exists) {
                newIndividualTeeth.push({
                  toothNumber,
                  type,
                  prescriptionType
                });
              }
            } else {
              const hasPontics = group.pontics && group.pontics.length > 0;
              finalGroups.push({
                ...group,
                type: hasPontics ? 'bridge' : 'joint',
                pontics: group.pontics ? group.pontics.filter((p: number) => group.teeth.includes(p)) : [],
              });
            }
          });

          updateSelection(finalGroups, newIndividualTeeth);
        }
        return;
      }
    }
    if (Array.isArray(teeth) && teeth.length > 1) {
      const involvedGroups = localSelectedGroups.filter(group => group.teeth.some(tooth => teeth.includes(tooth)));
      const allTeethInConnection = new Set<number>();
      involvedGroups.forEach(group => {
        group.teeth.forEach(tooth => allTeethInConnection.add(tooth));
      });
      teeth.forEach(tooth => allTeethInConnection.add(tooth));
      const finalTeethArray = Array.from(allTeethInConnection);

      const upperArch = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
      const lowerArch = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
      const isFullUpperArch = upperArch.every(t => finalTeethArray.includes(t)) && finalTeethArray.length === upperArch.length;
      const isFullLowerArch = lowerArch.every(t => finalTeethArray.includes(t)) && finalTeethArray.length === lowerArch.length;

      const isContinuousArch = (arr: number[], arch: number[]): boolean => {
        const sorted = arr.slice().sort((a: number, b: number) => arch.indexOf(a) - arch.indexOf(b));
        for (let i = 0; i < sorted.length - 1; i++) {
          if (arch.indexOf(sorted[i + 1]) - arch.indexOf(sorted[i]) !== 1) {
            return false;
          }
        }
        return true;
      };
      const isValidUpperSequence = finalTeethArray.every(t => upperArch.includes(t)) && isContinuousArch(finalTeethArray, upperArch);
      const isValidLowerSequence = finalTeethArray.every(t => lowerArch.includes(t)) && isContinuousArch(finalTeethArray, lowerArch);

      if (!(isFullUpperArch || isFullLowerArch || isValidUpperSequence || isValidLowerSequence)) {
        if (!validateTeethSequence(finalTeethArray)) {
          console.log('Connection rejected: final sequence would create non-adjacent connections');
          return;
        }
      }
      const connectedTeethData: SelectedTooth[] = [];
      Array.from(allTeethInConnection).forEach((toothNumber: number) => {
        const individualTooth = localSelectedTeeth.find(t => t.toothNumber === toothNumber);
        if (individualTooth) {
          connectedTeethData.push(individualTooth);
        } else {
          connectedTeethData.push({
            toothNumber,
            type: 'abutment',
            prescriptionType
          });
        }
      });
      if (connectedTeethData.length < 2) return;
      const sortedTeeth = Array.from(allTeethInConnection).sort((a, b) => a - b);
      const allPontics = [
        ...connectedTeethData.filter(tooth => tooth.type === 'pontic').map(tooth => tooth.toothNumber),
        ...involvedGroups.flatMap(group => group.pontics || [])
      ];
      const uniquePontics = Array.from(new Set(allPontics)).filter(p => Array.from(allTeethInConnection).includes(p));
      const groupType = uniquePontics.length > 0 ? 'bridge' : 'joint';
      const newGroup: ToothGroup = {
        groupId: `group-${Date.now()}`,
        teeth: sortedTeeth,
        type: uniquePontics.length > 0 ? 'bridge' : 'joint',
        notes: '',
        material: '',
        shade: '',
        productType: 'implant',
        pontics: uniquePontics,
      };
      updateSelection(localSelectedGroups.filter(g => !involvedGroups.includes(g)).concat(newGroup), localSelectedTeeth.filter(t => !allTeethInConnection.has(t.toothNumber)));
    }
  };

  const handleUpdateGroup = (groupId: string, updatedGroup: ToothGroup) => {
    console.log('Updating group:', groupId, 'with:', updatedGroup);
    updateSelection(localSelectedGroups.map(g => g.groupId === groupId ? updatedGroup : g), localSelectedTeeth);
  };

  const handleUpdateTooth = (toothNumber: number, newType: 'abutment' | 'pontic') => {
    console.log('Updating individual tooth:', toothNumber, 'to type:', newType);
    updateSelection(localSelectedGroups, localSelectedTeeth.map(tooth => tooth.toothNumber === toothNumber ? {
      ...tooth,
      type: newType
    } : tooth));
  };

  const handleRemoveGroup = (groupId: string) => {
    console.log('Removing group:', groupId);
    const group = localSelectedGroups.find(g => g.groupId === groupId);
    if (group) {
      updateSelection(localSelectedGroups.filter(g => g.groupId !== groupId), localSelectedTeeth.concat(group.teeth.filter(toothNumber => !localSelectedTeeth.some(t => t.toothNumber === toothNumber)).map(toothNumber => ({
        toothNumber,
        type: 'abutment' as 'abutment',
        prescriptionType
      } as SelectedTooth))));
    }
    updateSelection(localSelectedGroups.filter(g => g.groupId !== groupId), localSelectedTeeth);
  };

  const handleRemoveTooth = (toothNumber: number) => {
    console.log('Removing individual tooth:', toothNumber);
    updateSelection(localSelectedGroups, localSelectedTeeth.filter(tooth => tooth.toothNumber !== toothNumber));
  };

  const resetForm = () => {
    setProductSelection(null);
    updateSelection(localSelectedGroups, localSelectedTeeth);
  };

  return <div className="flex gap-6">
    <div className="w-1/2">
      <Card className="shadow-sm bg-[#E2F4F1]">
        <CardContent className="p-3">
          <div className="mb-4">
            <ToothChart 
              selectedGroups={localSelectedGroups} 
              selectedTeeth={localSelectedTeeth} 
              onToothClick={handleToothClick} 
              onDragConnection={handleDragConnection} 
              isToothSelected={isToothSelected} 
              getToothType={getToothType} 
              onGroupsChange={groups => updateSelection(groups, localSelectedTeeth)} 
              setSelectedTeeth={teeth => updateSelection(localSelectedGroups, teeth as SelectedTooth[])} 
            />
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="w-1/2 space-y-4">
      {(localSelectedGroups.length > 0 || localSelectedTeeth.length > 0) && (
        <Card className="border shadow-sm">
          <CardContent className="p-3">
            <SelectedToothGroups 
              selectedGroups={localSelectedGroups} 
              selectedTeeth={localSelectedTeeth} 
              onRemoveGroup={handleRemoveGroup} 
              onRemoveTooth={handleRemoveTooth} 
              onUpdateGroup={handleUpdateGroup} 
              onUpdateTooth={handleUpdateTooth} 
              onAddIndividualTooth={(toothNumber, type) => updateSelection(localSelectedGroups, localSelectedTeeth.concat({ toothNumber, type, prescriptionType }))}
              prescriptionType={prescriptionType} 
            />
          </CardContent>
        </Card>
      )}
      
      <Card className="border shadow-sm">
        <CardContent className="p-3">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Instructions</h4>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-start gap-2">
              <span className="text-blue-500">1.</span>
              <span>Click any tooth to select as Abutment or Pontic</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500">2.</span>
              <span>Drag between teeth to create groups</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500">3.</span>
              <span>Groups with pontics become Bridges, without pontics become Joints</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500">4.</span>
              <span>Double-click connector lines to split groups</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500">5.</span>
              <span>⚠️ Connections that skip teeth are blocked for clinical accuracy</span>
            </div>
          </div>

          <h4 className="text-sm font-semibold text-gray-900 mb-3 mt-4">Visual Legend</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Abutment (Individual)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Joint Group</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>Bridge Group</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span>Pontic</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <ToothTypeDialog
      isOpen={showTypeDialog}
      onClose={() => setShowTypeDialog(false)}
      toothNumber={clickedTooth || 0}
      position={dialogPosition}
      onSelectType={handleToothTypeSelection}
      selectedGroups={localSelectedGroups}
      onJoinGroup={handleJoinGroup}
      debugMode={false}
      prescriptionType={prescriptionType}
    />
  </div>;
};
export default ToothSelector;