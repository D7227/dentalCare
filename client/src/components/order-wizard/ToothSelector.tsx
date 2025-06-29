import React, { useState, useCallback } from 'react';
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
  selectedGroups: ToothGroup[];
  onGroupsChange: (groups: ToothGroup[]) => void;
  onProductComplete?: () => void;
}
interface SelectedTooth {
  toothNumber: number;
  type: 'abutment' | 'pontic';
}
const ToothSelector = ({
  selectedGroups,
  onGroupsChange,
  onProductComplete
}: ToothSelectorProps) => {
  const [productSelection, setProductSelection] = useState<'implant' | 'crown-bridge' | null>(null);
  const [selectedTeeth, setSelectedTeeth] = useState<SelectedTooth[]>([]);
  const [showTypeDialog, setShowTypeDialog] = useState(false);
  const [dialogPosition, setDialogPosition] = useState({
    x: 0,
    y: 0
  });
  const [clickedTooth, setClickedTooth] = useState<number | null>(null);
  const [deliveryType, setDeliveryType] = useState<'digital' | 'manual' | null>(null);

  // Is a tooth selected?
  const isToothSelected = useCallback((toothNumber: number) => {
    return selectedTeeth.some(tooth => tooth.toothNumber === toothNumber) || selectedGroups.some(group => group.teeth.includes(toothNumber));
  }, [selectedTeeth, selectedGroups]);

  // Get tooth type
  const getToothType = useCallback((toothNumber: number): 'abutment' | 'pontic' | null => {
    
    // Check individual teeth first
    const selectedTooth = selectedTeeth.find(tooth => tooth.toothNumber === toothNumber);
    if (selectedTooth) {
      return selectedTooth.type;
    }
    
    // Check groups
    for (const group of selectedGroups) {
      if (group.teeth.includes(toothNumber)) {
        if (group.pontics && group.pontics.includes(toothNumber)) {
          return 'pontic';
        }
        return 'abutment';
      }
    }
    
    return null;
  }, [selectedTeeth, selectedGroups]);

  // Strict adjacency check - only allows directly adjacent teeth based on FDI numbering
  const areTeethStrictlyAdjacent = (tooth1: number, tooth2: number): boolean => {
    console.log('Checking strict adjacency between', tooth1, 'and', tooth2);

    // Define arch sequences (FDI numbering)
    const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
    const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
    const lowerLeft = [31, 32, 33, 34, 35, 36, 37, 38];
    const lowerRight = [41, 42, 43, 44, 45, 46, 47, 48];

    // Check adjacency within same quadrant
    const checkQuadrantAdjacency = (quadrant: number[]) => {
      const index1 = quadrant.indexOf(tooth1);
      const index2 = quadrant.indexOf(tooth2);
      if (index1 !== -1 && index2 !== -1) {
        return Math.abs(index1 - index2) === 1;
      }
      return false;
    };

    // Check within each quadrant
    if (checkQuadrantAdjacency(upperRight)) return true;
    if (checkQuadrantAdjacency(upperLeft)) return true;
    if (checkQuadrantAdjacency(lowerLeft)) return true;
    if (checkQuadrantAdjacency(lowerRight)) return true;

    // Special cross-quadrant connections (center line)
    if ((tooth1 === 11 && tooth2 === 21) || (tooth1 === 21 && tooth2 === 11)) return true;
    if (tooth1 === 31 && tooth2 === 41 || tooth1 === 41 && tooth2 === 31) return true;
    console.log('Teeth', tooth1, 'and', tooth2, 'are NOT strictly adjacent');
    return false;
  };

  // Validate if a sequence of teeth can form a valid connection (all must be adjacent)
  const validateTeethSequence = (teeth: number[]): boolean => {
    if (teeth.length < 2) return true;
    // Do not sort, check in the order provided
    for (let i = 0; i < teeth.length - 1; i++) {
      if (!areTeethStrictlyAdjacent(teeth[i], teeth[i + 1])) {
        console.log('Invalid sequence: gap between', teeth[i], 'and', teeth[i + 1]);
        return false;
      }
    }
    console.log('Sequence is valid');
    return true;
  };

  // Handle tooth click
  const handleToothClick = (toothNumber: number, event: React.MouseEvent) => {
    const rect = (event.target as Element).getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    // If tooth is already selected, deselect it and update groups
    if (isToothSelected(toothNumber)) {
      handleToothDeselection(toothNumber);
      return;
    }

    // Show type selection dialog for new tooth
    setClickedTooth(toothNumber);
    setDialogPosition(position);
    setShowTypeDialog(true);
  };

  // Handle tooth deselection and group modification
  const handleToothDeselection = (toothNumber: number) => {
    console.log('Deselecting tooth:', toothNumber);

    // Check if tooth is in a group
    const groupContainingTooth = selectedGroups.find(g => g.teeth.includes(toothNumber));
    if (groupContainingTooth) {
      console.log('Tooth is in group:', groupContainingTooth.groupId);
      if (groupContainingTooth.teeth.length === 1) {
        // Remove entire group if it only has one tooth
        console.log('Removing entire group');
        onGroupsChange(selectedGroups.filter(g => g.groupId !== groupContainingTooth.groupId));
      } else if (groupContainingTooth.teeth.length === 2) {
        // Convert remaining tooth to individual tooth
        const remainingTooth = groupContainingTooth.teeth.find(t => t !== toothNumber);
        if (remainingTooth) {
          console.log('Converting remaining tooth to individual:', remainingTooth);
          const remainingToothType = 'abutment';

          // Remove group and add remaining tooth as individual
          onGroupsChange(selectedGroups.filter(g => g.groupId !== groupContainingTooth.groupId));
          setSelectedTeeth(prev => [...prev, {
            toothNumber: remainingTooth,
            type: remainingToothType
          }]);
        }
      } else {
        // Remove tooth from multi-tooth group and check for fragmentation
        const updatedTeeth = groupContainingTooth.teeth.filter(t => t !== toothNumber);

        // Check if remaining teeth are still valid (all adjacent)
        if (validateTeethSequence(updatedTeeth)) {
          // Teeth are still connected, update the group
          console.log('Updating group with remaining connected teeth');
          const updatedGroup = {
            ...groupContainingTooth,
            teeth: updatedTeeth,
            pontics: groupContainingTooth.pontics ? groupContainingTooth.pontics.filter((p: number) => updatedTeeth.includes(p)) : [],
          };
          onGroupsChange(selectedGroups.map(g => g.groupId === groupContainingTooth.groupId ? updatedGroup : g));
        } else {
          // Split into valid adjacent fragments
          console.log('Splitting into valid adjacent fragments');
          const fragments = findValidAdjacentFragments(updatedTeeth);
          const remainingGroups = selectedGroups.filter(g => g.groupId !== groupContainingTooth.groupId);
          const newGroups = [...remainingGroups];
          const newIndividualTeeth = [...selectedTeeth];
          fragments.forEach((fragment, index) => {
            if (fragment.length === 1) {
              // Single tooth becomes individual
              const toothNum = fragment[0];
              // Check if it was a pontic in the group
              const wasPontic = groupContainingTooth.pontics?.includes(toothNum);
              const type = wasPontic ? 'pontic' : 'abutment';
              newIndividualTeeth.push({
                toothNumber: toothNum,
                type
              });
            } else {
              // Multiple teeth form new group
              const pontics = groupContainingTooth.pontics ? groupContainingTooth.pontics.filter((p: number) => fragment.includes(p)) : [];
              const newGroup: ToothGroup = {
                groupId: `group-${Date.now()}-${index}`,
                teeth: fragment,
                type: pontics.length > 0 ? 'bridge' : 'joint',
                notes: groupContainingTooth.notes,
                material: groupContainingTooth.material,
                shade: groupContainingTooth.shade,
                productType: 'implant', // or 'crown-bridge' if that's the context
                pontics,
              };
              newGroups.push(newGroup);
            }
          });
          onGroupsChange(newGroups);
          setSelectedTeeth(newIndividualTeeth);
        }
      }
    } else {
      // Remove individual tooth
      console.log('Removing individual tooth');
      setSelectedTeeth(prev => prev.filter(tooth => tooth.toothNumber !== toothNumber));
    }
  };

  // Find valid adjacent fragments from a list of teeth
  const findValidAdjacentFragments = (teeth: number[]): number[][] => {
    if (teeth.length === 0) return [];
    // FDI arch orders
    const upperArch = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
    const lowerArch = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
    // Determine arch
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

  // Handle tooth type selection
  const handleToothTypeSelection = (type: 'abutment' | 'pontic') => {
    if (clickedTooth === null) return;
    setSelectedTeeth(prev => [...prev, {
      toothNumber: clickedTooth,
      type
    }]);
    setShowTypeDialog(false);
    setClickedTooth(null);
  };

  // Handle joining tooth to existing group
  const handleJoinGroup = (toothNumber: number, groupId: string) => {
    console.log('Joining tooth', toothNumber, 'to group', groupId);

    const targetGroup = selectedGroups.find(g => g.groupId === groupId);
    if (!targetGroup) return;

    // Add the tooth to the group
    const updatedGroup = {
      ...targetGroup,
      teeth: [...targetGroup.teeth, toothNumber].sort((a, b) => a - b)
    };

    // Update the groups
    onGroupsChange(selectedGroups.map(g => g.groupId === groupId ? updatedGroup : g));

    // Close dialog
    setShowTypeDialog(false);
    setClickedTooth(null);
  };

  // Handle creating connections between multiple teeth - STRICT ADJACENCY ENFORCED
  const handleDragConnection = (teeth: number[] | number, splitData?: any) => {
    // Special signals for group operations
    if (typeof teeth === 'number') {
      if (teeth === -3) {
        // Remove 2-tooth group and add individual teeth
        if (splitData?.groupToRemove) {
          const group = splitData.groupToRemove;
          console.log('Removing 2-tooth group:', group.groupId);

          // Remove the group immediately
          const updatedGroups = selectedGroups.filter(g => g.groupId !== group.groupId);
          onGroupsChange(updatedGroups);

          // Add teeth as individuals immediately
          const newIndividualTeeth: SelectedTooth[] = [];
          group.teeth.forEach((toothNumber: number) => {
            const wasPontic = group.pontics?.includes(toothNumber);
            const type = wasPontic ? 'pontic' : 'abutment';
            const exists = selectedTeeth.some(tooth => tooth.toothNumber === toothNumber);
            if (!exists) {
              newIndividualTeeth.push({
                toothNumber,
                type
              });
            }
          });
          if (newIndividualTeeth.length > 0) {
            setSelectedTeeth(prev => [...prev, ...newIndividualTeeth]);
          }
        }
        return;
      }
      if (teeth === -4) {
        // Handle group split
        if (splitData?.originalGroup && splitData?.newGroups) {
          const {
            originalGroup,
            newGroups
          } = splitData;
          console.log('Splitting group:', originalGroup.groupId, 'into:', newGroups.length, 'groups');

          // Remove original group and add new groups immediately
          const updatedGroups = selectedGroups.filter(g => g.groupId !== originalGroup.groupId);
          const finalGroups = [...updatedGroups];
          const newIndividualTeeth: SelectedTooth[] = [];
          newGroups.forEach((group: ToothGroup) => {
            if (group.teeth.length === 1) {
              // Single tooth becomes individual
              const toothNumber = group.teeth[0];
              const wasPontic = group.pontics?.includes(toothNumber);
              const type = wasPontic ? 'pontic' : 'abutment';
              const exists = selectedTeeth.some(tooth => tooth.toothNumber === toothNumber);
              if (!exists) {
                newIndividualTeeth.push({
                  toothNumber,
                  type
                });
              }
            } else {
              // Multiple teeth stay as group, update type if needed
              const hasPontics = group.pontics && group.pontics.length > 0;
              finalGroups.push({
                ...group,
                type: hasPontics ? 'bridge' : 'joint',
                pontics: group.pontics ? group.pontics.filter((p: number) => group.teeth.includes(p)) : [],
              });
            }
          });

          // Update both groups and individual teeth immediately
          onGroupsChange(finalGroups);
          if (newIndividualTeeth.length > 0) {
            setSelectedTeeth(prev => [...prev, ...newIndividualTeeth]);
          }
        }
        return;
      }
    }
    if (Array.isArray(teeth) && teeth.length > 1) {
      // Group all teeth in the array
      const involvedGroups = selectedGroups.filter(group => group.teeth.some(tooth => teeth.includes(tooth)));
      const allTeethInConnection = new Set<number>();
      involvedGroups.forEach(group => {
        group.teeth.forEach(tooth => allTeethInConnection.add(tooth));
      });
      teeth.forEach(tooth => allTeethInConnection.add(tooth));
      const finalTeethArray = Array.from(allTeethInConnection);

      // Define full arch sets as explicit arrays (FDI arch order)
      const upperArch = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
      const lowerArch = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
      const isFullUpperArch = upperArch.every(t => finalTeethArray.includes(t)) && finalTeethArray.length === upperArch.length;
      const isFullLowerArch = lowerArch.every(t => finalTeethArray.includes(t)) && finalTeethArray.length === lowerArch.length;

      // Allow any continuous sequence within an arch (no gaps)
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

      // If not a full arch, allow if it's a continuous sequence in the arch
      if (!(isFullUpperArch || isFullLowerArch || isValidUpperSequence || isValidLowerSequence)) {
        if (!validateTeethSequence(finalTeethArray)) {
          console.log('Connection rejected: final sequence would create non-adjacent connections');
          return;
        }
      }
      const connectedTeethData: SelectedTooth[] = [];
      Array.from(allTeethInConnection).forEach((toothNumber: number) => {
        const individualTooth = selectedTeeth.find(t => t.toothNumber === toothNumber);
        if (individualTooth) {
          connectedTeethData.push(individualTooth);
        } else {
          connectedTeethData.push({
            toothNumber,
            type: 'abutment'
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
        productType: 'implant', // or 'crown-bridge' if that's the context
        pontics: uniquePontics,
      };
      setSelectedTeeth(prev => prev.filter(tooth => !allTeethInConnection.has(tooth.toothNumber)));
      const remainingGroups = selectedGroups.filter(group => !involvedGroups.includes(group));
      onGroupsChange([...remainingGroups, newGroup]);
      return;
    }
  };

  // Handle group updates
  const handleUpdateGroup = (groupId: string, updatedGroup: ToothGroup) => {
    console.log('Updating group:', groupId, 'with:', updatedGroup);
    onGroupsChange(selectedGroups.map(g => g.groupId === groupId ? updatedGroup : g));
  };

  // Handle individual tooth updates
  const handleUpdateTooth = (toothNumber: number, newType: 'abutment' | 'pontic') => {
    console.log('Updating individual tooth:', toothNumber, 'to type:', newType);
    setSelectedTeeth(prev => prev.map(tooth => tooth.toothNumber === toothNumber ? {
      ...tooth,
      type: newType
    } : tooth));
  };

  // Enhanced group removal that handles split functionality
  const handleRemoveGroup = (groupId: string) => {
    console.log('Removing group:', groupId);
    const group = selectedGroups.find(g => g.groupId === groupId);
    if (group) {
      // Add all teeth from the group as individual abutments (if not already present)
      setSelectedTeeth(prev => [
        ...prev,
        ...group.teeth.filter(toothNumber => !prev.some(t => t.toothNumber === toothNumber)).map(toothNumber => ({
          toothNumber,
          type: 'abutment' as 'abutment'
        }))
      ]);
    }
    onGroupsChange(selectedGroups.filter(g => g.groupId !== groupId));
  };

  // Enhanced individual tooth removal
  const handleRemoveTooth = (toothNumber: number) => {
    console.log('Removing individual tooth:', toothNumber);
    setSelectedTeeth(prev => prev.filter(tooth => tooth.toothNumber !== toothNumber));
  };

  // Reset form
  const resetForm = () => {
    setProductSelection(null);
    setSelectedTeeth([]);
  };

  return <div className="flex gap-6">
    <div className="w-1/2">
      <Card className="shadow-sm bg-[#E2F4F1]">
        <CardContent className="p-3">
          {/* Tooth Chart - Directly show since product is already selected */}
          <div className="mb-4">
            <ToothChart 
              selectedGroups={selectedGroups} 
              selectedTeeth={selectedTeeth} 
              onToothClick={handleToothClick} 
              onDragConnection={handleDragConnection} 
              isToothSelected={isToothSelected} 
              getToothType={getToothType} 
              onGroupsChange={onGroupsChange} 
              setSelectedTeeth={setSelectedTeeth} 
            />
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Right side */}
    <div className="w-1/2 space-y-4">

      {(selectedGroups.length > 0 || selectedTeeth.length > 0) && (
        <Card className="border shadow-sm">
          <CardContent className="p-3">
            <SelectedToothGroups 
              selectedGroups={selectedGroups} 
              selectedTeeth={selectedTeeth} 
              onRemoveGroup={handleRemoveGroup} 
              onRemoveTooth={handleRemoveTooth} 
              onUpdateGroup={handleUpdateGroup} 
              onUpdateTooth={handleUpdateTooth} 
              onAddIndividualTooth={(toothNumber, type) => setSelectedTeeth(prev => [...prev, { toothNumber, type }])} 
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

    {/* Tooth Type Selection Dialog */}
    <ToothTypeDialog
      isOpen={showTypeDialog}
      onClose={() => setShowTypeDialog(false)}
      toothNumber={clickedTooth || 0}
      position={dialogPosition}
      onSelectType={handleToothTypeSelection}
      selectedGroups={selectedGroups}
      onJoinGroup={handleJoinGroup}
      debugMode={false}
    />
  </div>;
};
export default ToothSelector;