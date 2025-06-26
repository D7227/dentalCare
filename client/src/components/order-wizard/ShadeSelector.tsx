
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ShadeSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

const ShadeSelector = ({ 
  value, 
  onValueChange, 
  label = "Shade Selection", 
  placeholder = "Select shade",
  className = ""
}: ShadeSelectorProps) => {
  const shadeOptions = [
    { value: 'a1', label: 'A1 - Vita Classic', family: 'Vita Classic' },
    { value: 'a2', label: 'A2 - Vita Classic', family: 'Vita Classic' },
    { value: 'a3', label: 'A3 - Vita Classic', family: 'Vita Classic' },
    { value: 'a3.5', label: 'A3.5 - Vita Classic', family: 'Vita Classic' },
    { value: 'b1', label: 'B1 - Vita Classic', family: 'Vita Classic' },
    { value: 'b2', label: 'B2 - Vita Classic', family: 'Vita Classic' },
    { value: 'b3', label: 'B3 - Vita Classic', family: 'Vita Classic' },
    { value: 'c1', label: 'C1 - Vita Classic', family: 'Vita Classic' },
    { value: 'c2', label: 'C2 - Vita Classic', family: 'Vita Classic' },
    { value: 'd2', label: 'D2 - Vita Classic', family: 'Vita Classic' },
    { value: '1m1', label: '1M1 - Vita 3D Master', family: 'Vita 3D Master' },
    { value: '1m2', label: '1M2 - Vita 3D Master', family: 'Vita 3D Master' },
    { value: '2l1.5', label: '2L1.5 - Vita 3D Master', family: 'Vita 3D Master' },
    { value: '2l2.5', label: '2L2.5 - Vita 3D Master', family: 'Vita 3D Master' },
    { value: '2m1', label: '2M1 - Vita 3D Master', family: 'Vita 3D Master' },
    { value: '2m2', label: '2M2 - Vita 3D Master', family: 'Vita 3D Master' },
    { value: '3m1', label: '3M1 - Vita 3D Master', family: 'Vita 3D Master' },
    { value: '3m2', label: '3M2 - Vita 3D Master', family: 'Vita 3D Master' }
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <Label className="text-sm font-semibold text-foreground">
        {label}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-12 border focus:border-primary transition-colors">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-white z-50">
          {shadeOptions.map((shade) => (
            <SelectItem key={shade.value} value={shade.value}>
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded border border-gray-300 flex-shrink-0"
                  style={{
                    background: shade.family === 'Vita Classic' 
                      ? `linear-gradient(135deg, ${getShadeColor(shade.value)}, ${getShadeColor(shade.value)}cc)`
                      : `linear-gradient(135deg, ${getShadeColor(shade.value)}, ${getShadeColor(shade.value)}dd)`
                  }}
                ></div>
                <span className="text-sm">{shade.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const getShadeColor = (shadeValue: string): string => {
  const shadeColors: Record<string, string> = {
    'a1': '#f5f0e8',
    'a2': '#f0e6d2',
    'a3': '#e8d4b0',
    'a3.5': '#e0c498',
    'b1': '#f2ede5',
    'b2': '#eddfcc',
    'b3': '#e6d1b3',
    'c1': '#f0ebe3',
    'c2': '#e9dcc8',
    'd2': '#e6d5b8',
    '1m1': '#f4f0e9',
    '1m2': '#efe7d8',
    '2l1.5': '#f1ebe4',
    '2l2.5': '#ead9c5',
    '2m1': '#f0e8dc',
    '2m2': '#e7d6c1',
    '3m1': '#eee4d7',
    '3m2': '#e4d1bb'
  };
  
  return shadeColors[shadeValue] || '#f0e6d2';
};

export default ShadeSelector;
