
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Package, CheckCircle, XCircle } from 'lucide-react';

interface AccessoryTaggingProps {
  formData: any;
  setFormData: (data: any) => void;
}

const AccessoryTagging = ({ formData, setFormData }: AccessoryTaggingProps) => {
  const accessories = [
    { id: 'bite-block', label: 'Bite Block' },
    { id: 'tray', label: 'Tray' },
    { id: 'mock-up', label: 'Mock-up' }
  ];

  const selectedAccessories = formData.accessories || [];
  const hasSelectedAccessories = selectedAccessories.length > 0;
  const hasOtherSelected = selectedAccessories.includes('other');
  const showOtherError = hasOtherSelected && (!formData.otherAccessory || formData.otherAccessory.trim() === '');

  const handleAccessoryChange = (accessoryId: string, checked: boolean) => {
    const currentAccessories = formData.accessories || [];
    if (checked) {
      setFormData({
        ...formData,
        accessories: [...currentAccessories, accessoryId]
      });
    } else {
      setFormData({
        ...formData,
        accessories: currentAccessories.filter((id: string) => id !== accessoryId)
      });
    }
  };

  const handleOtherAccessoryChange = (checked: boolean) => {
    if (checked) {
      const currentAccessories = formData.accessories || [];
      setFormData({
        ...formData,
        accessories: [...currentAccessories, 'other'],
        otherAccessory: ''
      });
    } else {
      const currentAccessories = formData.accessories || [];
      setFormData({
        ...formData,
        accessories: currentAccessories.filter((id: string) => id !== 'other'),
        otherAccessory: ''
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2">
          <Package size={20} />
          Accessories Sent with Case
        </CardTitle>
        <p className="text-sm text-muted-foreground">Select any accessories that will be included with this case</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-medium">Select Accessories</Label>
          
          {accessories.map((accessory) => (
            <div key={accessory.id} className="flex items-center space-x-3">
              <Checkbox
                id={accessory.id}
                checked={formData.accessories?.includes(accessory.id) || false}
                onCheckedChange={(checked) => handleAccessoryChange(accessory.id, checked as boolean)}
              />
              <Label 
                htmlFor={accessory.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {accessory.label}
              </Label>
            </div>
          ))}

          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="other-accessory"
                checked={formData.accessories?.includes('other') || false}
                onCheckedChange={handleOtherAccessoryChange}
              />
              <Label 
                htmlFor="other-accessory"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Other
              </Label>
            </div>
            
            {hasOtherSelected && (
              <div className="ml-6">
                <Input
                  placeholder="Specify other accessory..."
                  value={formData.otherAccessory || ''}
                  onChange={(e) => setFormData({...formData, otherAccessory: e.target.value})}
                  className={showOtherError ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''}
                />
                {showOtherError && (
                  <p className="text-destructive text-xs mt-1">Please specify the other accessory</p>
                )}
              </div>
            )}
          </div>
        </div>

        {hasSelectedAccessories && (
          <div className="border-t pt-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">Return of Original Accessories</Label>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium">Doctor requests return of original accessories</p>
                  <p className="text-xs text-muted-foreground">Should we return any original accessories sent with this case?</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    variant={formData.returnAccessories === true ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({...formData, returnAccessories: true})}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle size={16} />
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={formData.returnAccessories === false ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setFormData({...formData, returnAccessories: false})}
                    className="flex items-center gap-2"
                  >
                    <XCircle size={16} />
                    No
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {hasSelectedAccessories && (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <h4 className="text-sm font-medium text-primary mb-2">Selected Accessories:</h4>
            <ul className="text-sm text-primary/80">
              {formData.accessories.map((accessoryId: string) => {
                if (accessoryId === 'other') {
                  return formData.otherAccessory ? (
                    <li key={accessoryId}>
                      • Other: {formData.otherAccessory}
                    </li>
                  ) : null;
                }
                const accessory = accessories.find(acc => acc.id === accessoryId);
                return <li key={accessoryId}>• {accessory?.label}</li>;
              })}
            </ul>
          </div>
        )}

        {!hasSelectedAccessories && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground italic">No accessories will be provided with this case</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccessoryTagging;
