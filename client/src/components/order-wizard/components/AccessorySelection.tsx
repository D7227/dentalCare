
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Search, Plus, Minus, X } from 'lucide-react';

interface AccessorySelectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

interface SelectedAccessory {
  id: string;
  name: string;
  quantity: number;
}

const AccessorySelection = ({ formData, setFormData }: AccessorySelectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample accessories for the searchbar
  const availableAccessories = [
    { id: 'impression-tray', name: 'Impression Tray' },
    { id: 'bite-registration', name: 'Bite Registration' },
    { id: 'shade-guide', name: 'Shade Guide' },
    { id: 'articulator', name: 'Articulator' },
    { id: 'face-bow', name: 'Face Bow' },
    { id: 'wax-rim', name: 'Wax Rim' },
    { id: 'temporary-crown', name: 'Temporary Crown' },
    { id: 'healing-cap', name: 'Healing Cap' },
    { id: 'abutment', name: 'Abutment' },
    { id: 'impression-post', name: 'Impression Post' },
    { id: 'transfer-coping', name: 'Transfer Coping' },
    { id: 'analog', name: 'Analog' }
  ];

  const selectedAccessories: SelectedAccessory[] = formData.selectedAccessories || [];

  const filteredAccessories = useMemo(() => {
    return availableAccessories.filter(accessory =>
      accessory.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedAccessories.some(selected => selected.id === accessory.id)
    );
  }, [searchQuery, selectedAccessories]);

  const addAccessory = (accessory: { id: string; name: string }) => {
    const newAccessory: SelectedAccessory = {
      id: accessory.id,
      name: accessory.name,
      quantity: 1
    };

    setFormData({
      ...formData,
      selectedAccessories: [...selectedAccessories, newAccessory]
    });
    setSearchQuery('');
  };

  const removeAccessory = (accessoryId: string) => {
    setFormData({
      ...formData,
      selectedAccessories: selectedAccessories.filter(acc => acc.id !== accessoryId)
    });
  };

  const updateQuantity = (accessoryId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setFormData({
      ...formData,
      selectedAccessories: selectedAccessories.map(acc =>
        acc.id === accessoryId ? { ...acc, quantity: newQuantity } : acc
      )
    });
  };

  const getTotalAccessories = () => {
    return selectedAccessories.reduce((total, acc) => total + acc.quantity, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
          <Package size={20} />
          Accessories Selection
        </CardTitle>
        <p className="text-xs sm:text-base">
          Search and add accessories needed for this case
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Bar */}
        <div className="space-y-2">
          <Label htmlFor="accessory-search">Search Accessories</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              id="accessory-search"
              placeholder="Type to search accessories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Search Results */}
          {searchQuery && filteredAccessories.length > 0 && (
            <div className="border rounded-lg bg-white shadow-sm max-h-48 overflow-y-auto">
              {filteredAccessories.map((accessory) => (
                <button
                  key={accessory.id}
                  onClick={() => addAccessory(accessory)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                >
                  <span className="text-sm font-medium">{accessory.name}</span>
                </button>
              ))}
            </div>
          )}

          {searchQuery && filteredAccessories.length === 0 && (
            <div className="text-sm text-gray-500 p-3 text-center border rounded-lg bg-gray-50">
              No accessories found matching "{searchQuery}"
            </div>
          )}
        </div>

        {/* Selected Accessories */}
        {selectedAccessories.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Selected Accessories</Label>
              <Badge variant="secondary" className="text-xs">
                {getTotalAccessories()} item{getTotalAccessories() !== 1 ? 's' : ''} total
              </Badge>
            </div>

            <div className="space-y-3">
              {selectedAccessories.map((accessory) => (
                <div
                  key={accessory.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex-1">
                    <span className="font-medium text-sm">{accessory.name}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(accessory.id, accessory.quantity - 1)}
                        disabled={accessory.quantity <= 1}
                        className="h-8 w-8 p-0"
                      >
                        <Minus size={14} />
                      </Button>
                      
                      <span className="min-w-[2rem] text-center text-sm font-medium">
                        {accessory.quantity}
                      </span>
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(accessory.id, accessory.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus size={14} />
                      </Button>
                    </div>

                    {/* Remove Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAccessory(accessory.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedAccessories.length === 0 && (
          <div className="p-6 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Package className="mx-auto mb-3 text-gray-400" size={32} />
            <p className="text-sm text-gray-500 font-medium mb-1">No accessories selected</p>
            <p className="text-xs text-gray-400">Use the search bar above to add accessories to this case</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccessorySelection;