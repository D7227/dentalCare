import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ToothChart from './components/ToothChart';
import SelectedToothGroups from './components/SelectedToothGroups';
import ToothTypeDialog from './components/ToothTypeDialog';
import ToothUnselectDialog from './components/ToothUnselectDialog';
import { ToothGroup, ToothDetail, LegacyToothGroup } from './types/tooth';
import { CrownBridgeTeeth, ImpantTeeth } from '@/assets/svg';
import RadioCardGroup from '../common/RadioCardGroup';

interface ToothSelectorProps {
  prescriptionType: 'implant' | 'crown-bridge';
  selectedGroups: ToothGroup[];
  selectedTeeth: SelectedTooth[];
  onGroupsChange?: (groups: ToothGroup[], teeth: SelectedTooth[]) => void;
  onSelectionChange: (groups: ToothGroup[], teeth: SelectedTooth[]) => void;
  onProductComplete?: () => void;
}

interface SelectedTooth {
  prescriptionType: 'implant' | 'crown-bridge';
  toothNumber: number;
  type: 'abutment' | 'pontic';
  selectedProducts?: any[];
  productDetails?: any;
}

// Helper functions to convert between new and legacy formats
const convertToLegacyGroups = (groups: ToothGroup[]): LegacyToothGroup[] => {
  return groups.map((group, index) => {
    const allTeeth = group.teethDetails.flat().map(tooth => tooth.teethNumber);
    const pontics = group.teethDetails.flat()
      .filter(tooth => tooth.type === 'pontic')
      .map(tooth => tooth.teethNumber);
    
    return {
      groupId: `group-${Date.now()}-${index}`,
      teeth: allTeeth,
      type: group.groupType,
      productType: 'implant',
      notes: '',
      material: group.teethDetails.flat()[0]?.productName || '',
      shade: group.teethDetails.flat()[0]?.shadeDetails || '',
      pontics: pontics.length > 0 ? pontics : undefined,
    };
  });
};

const convertToNewGroups = (legacyGroups: LegacyToothGroup[]): ToothGroup[] => {
  return legacyGroups.map(group => {
    const teethDetails: ToothDetail[][] = [];
    
    // Group teeth by adjacency
    const sortedTeeth = group.teeth.sort((a, b) => a - b);
    let currentGroup: ToothDetail[] = [];
    
    sortedTeeth.forEach(toothNumber => {
      const isPontic = group.pontics?.includes(toothNumber) || false;
      const toothDetail: ToothDetail = {
        teethNumber: toothNumber,
        productName: group.material || 'gold',
        productQuantity: 1,
        shadeDetails: group.shade || '',
        occlusalStaining: group.occlusalStaining || '',
        shadeGuide: [],
        shadeNotes: '',
        trialRequirements: '',
        type: isPontic ? 'pontic' : 'abutment'
      };
      
      currentGroup.push(toothDetail);
    });
    
    if (currentGroup.length > 0) {
      teethDetails.push(currentGroup);
    }
    
    return {
      groupType: group.type,
      teethDetails
    };
  });
};

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
  const [showUnselectDialog, setShowUnselectDialog] = useState(false);
  const [dialogPosition, setDialogPosition] = useState({
    x: 0,
    y: 0
  });
  const [clickedTooth, setClickedTooth] = useState<number | null>(null);
  const [deliveryType, setDeliveryType] = useState<'digital' | 'manual' | null>(null);

  console.log('selectedTeeth', selectedTeeth);
  console.log('selectedGroups', selectedGroups);
  console.log('onGroupsChange', onGroupsChange);
  console.log('onSelectionChange', onSelectionChange);
  console.log('onProductComplete', onProductComplete);

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
    if (onGroupsChange) onGroupsChange(groups, teeth);
  };

  const isToothSelected = useCallback((toothNumber: number) => {
    const inGroups = localSelectedGroups.some(group => 
      group.teethDetails.flat().some(tooth => tooth.teethNumber === toothNumber)
    );
    const inIndividualTeeth = localSelectedTeeth.some(tooth => tooth.toothNumber === toothNumber);
    return inGroups || inIndividualTeeth;
  }, [localSelectedTeeth, localSelectedGroups]);

  const getToothType = useCallback((toothNumber: number): 'abutment' | 'pontic' | null => {
    // Check individual teeth first
    const selectedTooth = localSelectedTeeth.find(tooth => tooth.toothNumber === toothNumber);
    if (selectedTooth) {
      return selectedTooth.type;
    }
    
    // Check in groups
    for (const group of localSelectedGroups) {
      const toothDetail = group.teethDetails.flat().find(tooth => tooth.teethNumber === toothNumber);
      if (toothDetail) {
        return toothDetail.type;
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
      // Only show unselect dialog for pontic teeth
      const toothType = getToothType(toothNumber);
      if (toothType === 'pontic') {
        setClickedTooth(toothNumber);
        setDialogPosition(position);
        setShowUnselectDialog(true);
        return;
      } else {
        // For abutment teeth, directly unselect
        handleToothDeselection(toothNumber);
        return;
      }
    }

    setClickedTooth(toothNumber);
    setDialogPosition(position);
    setShowTypeDialog(true);
  };

  const handleToothDeselection = (toothNumber: number) => {
    console.log('Deselecting tooth:', toothNumber);

    const groupContainingTooth = localSelectedGroups.find(g =>
      g.teethDetails.flat().some(tooth => tooth.teethNumber === toothNumber)
    );

    if (groupContainingTooth) {
      console.log('Tooth is in group:', groupContainingTooth.groupType);
      // Find all instances of this tooth number in the group
      const allTeethInGroup = groupContainingTooth.teethDetails.flat();
      const pontics = allTeethInGroup.filter(t => t.teethNumber === toothNumber && t.type === 'pontic');
      const abutments = allTeethInGroup.filter(t => t.teethNumber === toothNumber && t.type === 'abutment');

      // If there are multiple pontics, remove only one
      if (pontics.length > 0) {
        let removed = false;
        const updatedTeethDetails = groupContainingTooth.teethDetails.map(group =>
          group.filter(tooth => {
            if (!removed && tooth.teethNumber === toothNumber && tooth.type === 'pontic') {
              removed = true;
              return false; // remove only one instance
            }
            return true;
          })
        ).filter(group => group.length > 0);

        // If group is empty after removal, remove the group
        if (updatedTeethDetails.length === 0) {
          updateSelection(
            localSelectedGroups.filter(g => g !== groupContainingTooth),
            localSelectedTeeth
          );
        } else {
          const updatedGroup: ToothGroup = {
            ...groupContainingTooth,
            teethDetails: updatedTeethDetails
          };
          updateSelection(
            localSelectedGroups.map(g => g === groupContainingTooth ? updatedGroup : g),
            localSelectedTeeth
          );
        }
        return;
      }

      // If there are abutments (and no pontics), remove the abutment as before
      if (abutments.length > 0) {
        // Remove abutment logic (same as before)
        const allTeethNumbers = allTeethInGroup.map(t => t.teethNumber);
        const remainingTeeth = allTeethNumbers.filter(t => t !== toothNumber);
        if (remainingTeeth.length === 0) {
          updateSelection(
            localSelectedGroups.filter(g => g !== groupContainingTooth),
            localSelectedTeeth.filter(t => t.toothNumber !== toothNumber)
          );
        } else if (remainingTeeth.length === 1) {
          const remainingToothNumber = remainingTeeth[0];
          const remainingToothDetail = groupContainingTooth.teethDetails.flat().find(tooth => tooth.teethNumber === remainingToothNumber);
          const remainingToothType = remainingToothDetail?.type || 'abutment';
          updateSelection(
            localSelectedGroups.filter(g => g !== groupContainingTooth),
            localSelectedTeeth.filter(t => t.toothNumber !== toothNumber).concat({
              toothNumber: remainingToothNumber,
              type: remainingToothType,
              prescriptionType
            })
          );
        } else {
          if (validateTeethSequence(remainingTeeth)) {
            const updatedTeethDetails = groupContainingTooth.teethDetails.map(group =>
              group.filter(tooth => tooth.teethNumber !== toothNumber)
            ).filter(group => group.length > 0);
            const updatedGroup: ToothGroup = {
              ...groupContainingTooth,
              teethDetails: updatedTeethDetails
            };
            updateSelection(
              localSelectedGroups.map(g => g === groupContainingTooth ? updatedGroup : g),
              localSelectedTeeth.filter(t => t.toothNumber !== toothNumber)
            );
          } else {
            const fragments = findValidAdjacentFragments(remainingTeeth);
            const remainingGroups = localSelectedGroups.filter(g => g !== groupContainingTooth);
            const newGroups = [...remainingGroups];
            const newIndividualTeeth = [...localSelectedTeeth.filter(t => t.toothNumber !== toothNumber)];
            fragments.forEach((fragment, index) => {
              if (fragment.length === 1) {
                const toothNum = fragment[0];
                const toothDetail = groupContainingTooth.teethDetails.flat().find(t => t.teethNumber === toothNum);
                const type = toothDetail?.type || 'abutment';
                newIndividualTeeth.push({
                  toothNumber: toothNum,
                  type,
                  prescriptionType
                });
              } else {
                const fragmentTeethDetails: ToothDetail[] = fragment.map(toothNum => {
                  const toothDetail = groupContainingTooth.teethDetails.flat().find(t => t.teethNumber === toothNum);
                  return toothDetail || {
                    teethNumber: toothNum,
                    productName: 'gold',
                    productQuantity: 1,
                    shadeDetails: '',
                    occlusalStaining: '',
                    shadeGuide: [],
                    shadeNotes: '',
                    trialRequirements: '',
                    type: 'abutment' as 'abutment'
                  };
                });
                const hasPontics = fragmentTeethDetails.some(tooth => tooth.type === 'pontic');
                const newGroup: ToothGroup = {
                  groupType: hasPontics ? 'bridge' : 'joint',
                  teethDetails: [fragmentTeethDetails],
                };
                newGroups.push(newGroup);
              }
            });
            updateSelection(newGroups, newIndividualTeeth);
          }
        }
      }
    } else {
      // Not in a group, remove from individual teeth
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

  const handleToothUnselect = () => {
    if (clickedTooth === null) return;
    handleToothDeselection(clickedTooth);
  };

  const handleAddPontic = () => {
    if (clickedTooth === null) return;
    // Find the group containing this tooth
    const groupContainingTooth = localSelectedGroups.find(g =>
      g.teethDetails.flat().some(tooth => tooth.teethNumber === clickedTooth)
    );

    if (groupContainingTooth) {
      // Find the group array and index of the last occurrence
      let lastGroupIdx = -1;
      let lastToothIdx = -1;
      groupContainingTooth.teethDetails.forEach((groupArr, groupIdx) => {
        groupArr.forEach((tooth, toothIdx) => {
          if (tooth.teethNumber === clickedTooth) {
            lastGroupIdx = groupIdx;
            lastToothIdx = toothIdx;
          }
        });
      });
      if (lastGroupIdx !== -1 && lastToothIdx !== -1) {
        const groupArr = groupContainingTooth.teethDetails[lastGroupIdx];
        const existingToothDetail = groupArr[lastToothIdx];
        const newPonticDetail: ToothDetail = {
          ...existingToothDetail,
          type: 'pontic'
        };
        // Insert after the last occurrence
        const updatedGroupArr = [
          ...groupArr.slice(0, lastToothIdx + 1),
          newPonticDetail,
          ...groupArr.slice(lastToothIdx + 1)
        ];
        const updatedTeethDetails = groupContainingTooth.teethDetails.map((arr, idx) =>
          idx === lastGroupIdx ? updatedGroupArr : arr
        );
        const updatedGroup: ToothGroup = {
          ...groupContainingTooth,
          teethDetails: updatedTeethDetails
        };
        updateSelection(
          localSelectedGroups.map(g => g === groupContainingTooth ? updatedGroup : g),
          localSelectedTeeth
        );
        return;
      }
    }
    // If it's an individual tooth, convert it to a group with two pontics
    const individualTooth = localSelectedTeeth.find(t => t.toothNumber === clickedTooth);
    if (individualTooth) {
      const newGroup: ToothGroup = {
        groupType: 'bridge',
        teethDetails: [[
          {
            teethNumber: clickedTooth,
            productName: 'gold',
            productQuantity: 1,
            shadeDetails: '',
            occlusalStaining: '',
            shadeGuide: [],
            shadeNotes: '',
            trialRequirements: '',
            type: 'pontic'
          },
          {
            teethNumber: clickedTooth,
            productName: 'gold',
            productQuantity: 1,
            shadeDetails: '',
            occlusalStaining: '',
            shadeGuide: [],
            shadeNotes: '',
            trialRequirements: '',
            type: 'pontic'
          }
        ]]
      };
      updateSelection(
        [...localSelectedGroups, newGroup],
        localSelectedTeeth.filter(t => t.toothNumber !== clickedTooth)
      );
    }
  };

  const handleToothTypeSelection = (type: 'abutment' | 'pontic') => {
    if (clickedTooth === null) return;

    updateSelection(localSelectedGroups, localSelectedTeeth.concat({
      toothNumber: clickedTooth,
      type,
      prescriptionType,
      selectedProducts: [],
      productDetails: {},
    }));

    setShowTypeDialog(false);
    setClickedTooth(null);
  };

  const handleJoinGroup = (toothNumber: number, groupIndex: number) => {
    console.log('Joining tooth', toothNumber, 'to group', groupIndex);

    const targetGroup = localSelectedGroups[groupIndex];
    if (!targetGroup) return;

    // Create new tooth detail
    const newToothDetail: ToothDetail = {
      teethNumber: toothNumber,
      productName: 'gold',
      productQuantity: 1,
      shadeDetails: '',
      occlusalStaining: '',
      shadeGuide: [],
      shadeNotes: '',
      trialRequirements: '',
      type: 'abutment'
    };

    // Insert at the beginning or end based on adjacency
    let updatedTeethDetails = [...targetGroup.teethDetails];
    if (updatedTeethDetails.length > 0) {
      const groupArr = updatedTeethDetails[0];
      if (groupArr.length > 0) {
        // If the new tooth is adjacent to the first, insert at the beginning
        if (areTeethStrictlyAdjacent(toothNumber, groupArr[0].teethNumber)) {
          updatedTeethDetails[0] = [newToothDetail, ...groupArr];
        } else if (areTeethStrictlyAdjacent(toothNumber, groupArr[groupArr.length - 1].teethNumber)) {
          updatedTeethDetails[0] = [...groupArr, newToothDetail];
        } else {
          // Default: append to the end
          updatedTeethDetails[0] = [...groupArr, newToothDetail];
        }
      } else {
        updatedTeethDetails[0] = [newToothDetail];
      }
    } else {
      updatedTeethDetails.push([newToothDetail]);
    }

    const updatedGroup: ToothGroup = {
      ...targetGroup,
      teethDetails: updatedTeethDetails
    };

    updateSelection(
      localSelectedGroups.map((g, index) => index === groupIndex ? updatedGroup : g),
      localSelectedTeeth.filter(t => t.toothNumber !== toothNumber)
    );

    setShowTypeDialog(false);
    setClickedTooth(null);
  };

  const handleDragConnection = (teeth: number[] | number, splitData?: any) => {
    if (typeof teeth === 'number') {
      if (teeth === -3) {
        // Remove group and add its teeth as individual teeth, preserving type/order
        if (splitData?.groupToRemove) {
          const group = splitData.groupToRemove;
          // Find the original group in localSelectedGroups by matching teethDetails
          const foundGroup = localSelectedGroups.find(g => {
            const a = g.teethDetails.flat().map(t => t.teethNumber).join(',');
            const b = group.teeth.join(',');
            return a === b;
          });
          let newIndividualTeeth = [...localSelectedTeeth];
          if (foundGroup) {
            // Add each tooth as an individual tooth with correct type/order
            foundGroup.teethDetails.flat().forEach(tooth => {
              newIndividualTeeth.push({
                toothNumber: tooth.teethNumber,
                type: tooth.type,
                prescriptionType
              });
            });
          }
          updateSelection(
            localSelectedGroups.filter(g => g !== foundGroup),
            newIndividualTeeth
          );
        }
        return;
      }
      if (teeth === -4) {
        // Split group into new groups or individual teeth, preserving type/order
        if (splitData?.originalGroup && splitData?.newGroups) {
          const { originalGroup, newGroups } = splitData;
          // Find the original group in localSelectedGroups
          const foundGroup = localSelectedGroups.find(g => {
            const a = g.teethDetails.flat().map(t => t.teethNumber).join(',');
            const b = originalGroup.teeth.join(',');
            return a === b;
          });
          const updatedGroups = localSelectedGroups.filter(g => g !== foundGroup);
          let finalGroups = [...updatedGroups];
          let newIndividualTeeth = [...localSelectedTeeth.filter(t => !originalGroup.teeth.includes(t.toothNumber))];
          newGroups.forEach((group: LegacyToothGroup) => {
            if (group.teeth.length === 1) {
              const toothNumber = group.teeth[0];
              const wasPontic = group.pontics?.includes(toothNumber);
              const type = wasPontic ? 'pontic' : 'abutment';
              newIndividualTeeth.push({
                toothNumber,
                type,
                prescriptionType
              });
            } else {
              // Build ToothDetail[] in the order of group.teeth
              const fragmentTeethDetails: ToothDetail[] = group.teeth.map(toothNumber => {
                const isPontic = group.pontics?.includes(toothNumber) || false;
                return {
                  teethNumber: toothNumber,
                  productName: group.material || 'gold',
                  productQuantity: 1,
                  shadeDetails: group.shade || '',
                  occlusalStaining: group.occlusalStaining || '',
                  shadeGuide: [],
                  shadeNotes: '',
                  trialRequirements: '',
                  type: isPontic ? 'pontic' : 'abutment'
                };
              });
              const hasPontics = fragmentTeethDetails.some(tooth => tooth.type === 'pontic');
              const newGroup: ToothGroup = {
                groupType: hasPontics ? 'bridge' : 'joint',
                teethDetails: [fragmentTeethDetails],
              };
              finalGroups.push(newGroup);
            }
          });
          updateSelection(finalGroups, newIndividualTeeth);
        }
        return;
      }
    }
    
    if (Array.isArray(teeth) && teeth.length > 1) {
      // Find involved groups and individual teeth
      const involvedGroups = localSelectedGroups.filter(group =>
        group.teethDetails.flat().some(tooth => teeth.includes(tooth.teethNumber))
      );
      // If all teeth are already in a single group, just merge the new tooth into that group
      if (involvedGroups.length === 1) {
        const group = involvedGroups[0];
        // Get all teeth in the group in order
        const groupTeeth = group.teethDetails.flat().map(t => t.teethNumber);
        // If the new teeth array is a superset of the group, merge in the new teeth in the order provided
        const missingTeeth = teeth.filter(t => !groupTeeth.includes(t));
        if (missingTeeth.length > 0) {
          // Build new group in the order of the teeth array, preserving type if already present
          const newTeethDetails: ToothDetail[] = teeth.map(toothNumber => {
            const existing = group.teethDetails.flat().find(t => t.teethNumber === toothNumber);
            if (existing) return existing;
            // Otherwise, use type from individual teeth if present
            const individual = localSelectedTeeth.find(t => t.toothNumber === toothNumber);
            return {
              teethNumber: toothNumber,
              productName: 'gold',
              productQuantity: 1,
              shadeDetails: '',
              occlusalStaining: '',
              shadeGuide: [],
              shadeNotes: '',
              trialRequirements: '',
              type: individual ? individual.type : 'abutment'
            };
          });
          const groupType = newTeethDetails.some(t => t.type === 'pontic') ? 'bridge' : 'joint';
          const updatedGroup: ToothGroup = {
            ...group,
            groupType,
            teethDetails: [newTeethDetails]
          };
          // Remove the group and any individual teeth now in the group
          const remainingGroups = localSelectedGroups.filter(g => g !== group);
          const remainingIndividualTeeth = localSelectedTeeth.filter(t => !teeth.includes(t.toothNumber));
          updateSelection([...remainingGroups, updatedGroup], remainingIndividualTeeth);
        }
        // If no missing teeth, do nothing (already in group)
        return;
      }
      // Build the connectedTeethData array in the order of the drag/select
      const connectedTeethData: ToothDetail[] = teeth.map(toothNumber => {
        // Check if tooth exists in individual teeth
        const individualTooth = localSelectedTeeth.find(t => t.toothNumber === toothNumber);
        if (individualTooth) {
          return {
            teethNumber: toothNumber,
            productName: 'gold',
            productQuantity: 1,
            shadeDetails: '',
            occlusalStaining: '',
            shadeGuide: [],
            shadeNotes: '',
            trialRequirements: '',
            type: individualTooth.type
          };
        } else {
          // Check if tooth exists in groups
          for (const group of involvedGroups) {
            const toothDetail = group.teethDetails.flat().find(t => t.teethNumber === toothNumber);
            if (toothDetail) {
              return toothDetail;
            }
          }
          // New tooth, default to abutment
          return {
            teethNumber: toothNumber,
            productName: 'gold',
            productQuantity: 1,
            shadeDetails: '',
            occlusalStaining: '',
            shadeGuide: [],
            shadeNotes: '',
            trialRequirements: '',
            type: 'abutment'
          };
        }
      });
      // Validate adjacency (optional: you can keep this logic if needed)
      const validateTeethSequence = (teeth: number[]): boolean => {
        if (teeth.length < 2) return true;
        for (let i = 0; i < teeth.length - 1; i++) {
          if (!areTeethStrictlyAdjacent(teeth[i], teeth[i + 1])) {
            return false;
          }
        }
        return true;
      };
      if (!validateTeethSequence(teeth)) {
        console.log('Connection rejected: final sequence would create non-adjacent connections');
        return;
      }
      // Determine group type
      const pontics = connectedTeethData.filter(tooth => tooth.type === 'pontic').map(tooth => tooth.teethNumber);
      const groupType = pontics.length > 0 ? 'bridge' : 'joint';
      // Create new group in the order of selection
      const newGroup: ToothGroup = {
        groupType,
        teethDetails: [connectedTeethData]
      };
      // Remove involved groups and individual teeth
      const allTeethInConnection = new Set(teeth);
      const remainingGroups = localSelectedGroups.filter(g => !involvedGroups.includes(g));
      const remainingIndividualTeeth = localSelectedTeeth.filter(t => !allTeethInConnection.has(t.toothNumber));
      updateSelection([...remainingGroups, newGroup], remainingIndividualTeeth);
    }
  };

  const handleUpdateGroup = (groupId: string, updatedGroup: LegacyToothGroup) => {
    console.log('Updating group:', groupId, 'with:', updatedGroup);
    const newGroups = convertToNewGroups([updatedGroup]);
    const groupIndex = localSelectedGroups.findIndex((_, index) => {
      const legacyGroup = convertToLegacyGroups([localSelectedGroups[index]])[0];
      return legacyGroup.groupId === groupId;
    });
    if (groupIndex !== -1) {
      updateSelection(
        localSelectedGroups.map((g, index) => index === groupIndex ? newGroups[0] : g),
        localSelectedTeeth
      );
    }
  };

  const handleUpdateTooth = (toothNumber: number, newType: 'abutment' | 'pontic') => {
    console.log('Updating individual tooth:', toothNumber, 'to type:', newType);
    updateSelection(localSelectedGroups, localSelectedTeeth.map(tooth => 
      tooth.toothNumber === toothNumber ? { ...tooth, type: newType } : tooth
    ));
  };

  const handleRemoveGroup = (groupIndex: number) => {
    console.log('Removing group:', groupIndex);
    const group = localSelectedGroups[groupIndex];
    if (group) {
      // Convert group teeth to individual teeth
      const groupTeeth = group.teethDetails.flat().map(tooth => ({
        toothNumber: tooth.teethNumber,
        type: tooth.type,
        prescriptionType,
        selectedProducts: [],
        productDetails: {}
      } as SelectedTooth));
      
      updateSelection(
        localSelectedGroups.filter((_, index) => index !== groupIndex),
        [...localSelectedTeeth, ...groupTeeth]
      );
    }
  };

  const handleRemoveTooth = (toothNumber: number) => {
    console.log('Removing individual tooth:', toothNumber);
    updateSelection(localSelectedGroups, localSelectedTeeth.filter(tooth => tooth.toothNumber !== toothNumber));
  };

  const resetForm = () => {
    setProductSelection(null);
    updateSelection(localSelectedGroups, localSelectedTeeth);
  };

  // Convert to legacy format for child components that still expect it
  const legacyGroups = convertToLegacyGroups(localSelectedGroups);

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
      <div className="w-full md:w-1/2 min-w-0">
        <Card className="shadow-sm bg-[#E2F4F1]">
          <CardContent className="p-2 sm:p-3">
            <div className="mb-4 overflow-x-auto">
              <div className="min-w-[320px] sm:min-w-0">
                <ToothChart 
                  selectedGroups={legacyGroups} 
                  selectedTeeth={localSelectedTeeth} 
                  onToothClick={handleToothClick} 
                  onDragConnection={handleDragConnection} 
                  isToothSelected={isToothSelected} 
                  getToothType={getToothType} 
                  onGroupsChange={groups => {
                    const newGroups = convertToNewGroups(groups);
                    updateSelection(newGroups, localSelectedTeeth);
                  }} 
                  setSelectedTeeth={teeth => updateSelection(localSelectedGroups, teeth as SelectedTooth[])} 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="w-full md:w-1/2 space-y-4 mt-4 md:mt-0">
        {(localSelectedGroups.length > 0 || localSelectedTeeth.length > 0) && ( 
          <Card className="border shadow-sm">
            <CardContent className="p-2 sm:p-3">
              <SelectedToothGroups 
                selectedGroups={legacyGroups} 
                selectedTeeth={localSelectedTeeth} 
                onRemoveGroup={(groupId) => {
                  const index = legacyGroups.findIndex(g => g.groupId === groupId);
                  if (index !== -1) handleRemoveGroup(index);
                }} 
                onRemoveTooth={handleRemoveTooth} 
                onUpdateGroup={handleUpdateGroup} 
                onUpdateTooth={handleUpdateTooth} 
                onAddIndividualTooth={(toothNumber, type) => updateSelection(localSelectedGroups, localSelectedTeeth.concat({ toothNumber, type, prescriptionType }))}
                prescriptionType={prescriptionType === 'crown-bridge' ? 'crown_bridge' : prescriptionType} 
              />
            </CardContent>
          </Card>
        )}
        <Card className="border shadow-sm">
          <CardContent className="p-2 sm:p-3">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">Instructions</h4>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-start gap-2">
                <span className="text-blue-500">1.</span>
                <span>Click any tooth to select as Abutment or Pontic</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-500">2.</span>
                <span>Click selected pontic teeth to remove or add another Pointic teeth</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-500">3.</span>
                <span>Drag between teeth to create groups</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-500">4.</span>
                <span>Groups with pontics become Bridges, without pontics become Joints</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-500">5.</span>
                <span>Double-click connector lines to split groups</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-500">6.</span>
                <span>⚠️ Connections that skip teeth are blocked for clinical accuracy</span>
              </div>
            </div>
            <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 mt-3 sm:mt-4">Visual Legend</h4>
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
        selectedGroups={legacyGroups}
        onJoinGroup={(toothNumber, groupId) => {
          const index = legacyGroups.findIndex(g => g.groupId === groupId);
          if (index !== -1) handleJoinGroup(toothNumber, index);
        }}
        debugMode={false}
        prescriptionType={prescriptionType}
      />
      <ToothUnselectDialog
        isOpen={showUnselectDialog}
        onClose={() => setShowUnselectDialog(false)}
        toothNumber={clickedTooth || 0}
        onUnselect={handleToothUnselect}
        onAddPontic={handleAddPontic}
      />
    </div>
  );
};

export default ToothSelector;