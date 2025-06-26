
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2 } from 'lucide-react';
import { ToothGroup } from '../types/tooth';

interface SelectedToothGroupsProps {
  selectedGroups: ToothGroup[];
  onRemoveGroup: (groupId: string) => void;
  onEditGroup?: (group: ToothGroup) => void;
}

const SelectedToothGroups = ({ selectedGroups, onRemoveGroup, onEditGroup }: SelectedToothGroupsProps) => {
  if (selectedGroups.length === 0) {
    return null;
  }

  const getRestorationTypeLabel = (type: string) => {
    switch (type) {
      case 'bridge': return 'Bridge';
      case 'joint': return 'Joint';
      case 'separate': return 'Separate';
      default: return type;
    }
  };

  const getRestorationTypeColor = (type: string) => {
    switch (type) {
      case 'bridge': return 'default';
      case 'joint': return 'secondary';
      case 'separate': return 'outline';
      default: return 'outline';
    }
  };

  const getMainCategoryLabel = (productType: string) => {
    switch (productType) {
      case 'implant': return 'Implant';
      case 'crown-bridge': return 'Crown & Bridge';
      default: return 'Product';
    }
  };

  const getMainCategoryColor = (productType: string) => {
    switch (productType) {
      case 'implant': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'crown-bridge': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h4 className="text-base font-semibold text-gray-900 mb-4">Selected Tooth Groups</h4>
      <div className="space-y-4">
        {selectedGroups.map((group) => (
          <div key={group.groupId} className="p-4 bg-gray-50 rounded-lg border animate-fade-in">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Main Category Tag - Read from group's productType */}
                <Badge 
                  className={`text-xs font-medium px-2 py-1 ${getMainCategoryColor(group.productType)}`}
                >
                  {getMainCategoryLabel(group.productType)}
                </Badge>
                
                {/* Restoration Type Tag */}
                <Badge 
                  variant={getRestorationTypeColor(group.type)} 
                  className="text-xs"
                >
                  {getRestorationTypeLabel(group.type)}
                </Badge>
                
                <span className="text-sm font-medium">
                  Teeth: {group.teeth.sort((a, b) => a - b).join(', ')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {onEditGroup && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditGroup(group)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1"
                    title="Edit tooth group"
                  >
                    <Edit2 size={14} />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveGroup(group.groupId)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                  title="Remove tooth group"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
            
            {/* Product Details */}
            <div className="grid grid-cols-1 gap-2 text-sm">
              {/* Selected Products */}
              {group.products && group.products.length > 0 && (
                <div className="space-y-1">
                  <span className="text-gray-600">Products:</span>
                  {group.products.map((product, index) => (
                    <Badge key={index} variant="outline" className="text-xs mr-2">
                      {product.name} (Qty: {product.quantity})
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Material fallback for legacy groups */}
              {group.material && (!group.products || group.products.length === 0) && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Material:</span>
                  <Badge variant="outline" className="text-xs">
                    {group.material}
                  </Badge>
                </div>
              )}
              
              {group.shade && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Shade:</span>
                  <Badge variant="outline" className="text-xs">
                    {group.shade}
                  </Badge>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Occlusal Staining:</span>
                <span className="text-xs text-gray-800 capitalize">
                  {group.occlusalStaining || 'Medium'}
                </span>
              </div>
              
              {group.type === 'bridge' && group.ponticDesign && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Pontic Design:</span>
                  <span className="text-xs text-gray-800 capitalize">
                    {group.ponticDesign}
                  </span>
                </div>
              )}
              
              {group.notes && (
                <div className="mt-2">
                  <span className="text-gray-600">Notes:</span>
                  <p className="text-xs text-gray-800 mt-1 italic">
                    {group.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedToothGroups;
