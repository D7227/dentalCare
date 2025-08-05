import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface TrialSelectorProps {
  productType: 'implant' | 'crown-bridge';
  selectedTrials: string[];
  onTrialsChange: (trials: string[]) => void;
}

const TrialSelector = ({ productType, selectedTrials, onTrialsChange }: TrialSelectorProps) => {
  const trialOptions = {
    'crown-bridge': [
      { value: 'print', label: 'Print Trial' },
      { value: 'metal', label: 'Metal Trial' },
      { value: 'bisque', label: 'Bisque Trial' }
    ],
    'implant': [
      { value: 'print', label: 'Print Trial' },
      { value: 'metal', label: 'Metal Trial' },
      { value: 'bisque', label: 'Bisque Trial' },
      { value: 'jig', label: 'Jig Trial' }
    ]
  };

  const handleTrialChange = (trialValue: string, checked: boolean) => {
    if (checked) {
      onTrialsChange([trialValue]);
    } else {
      onTrialsChange([]);
    }
  };

  const currentTrials = trialOptions[productType];

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Trial Requirements</Label>
      <div className="flex flex-wrap gap-3">
        {currentTrials.map((trial) => (
          <div key={trial.value} className=" items-center flex justify-center content-center gap-1">
            <Checkbox
            className='inline'
              id={trial.value}
              checked={selectedTrials[0] === trial.value}
              onCheckedChange={(checked) => handleTrialChange(trial.value, checked as boolean)}
            />
            <Label 
              htmlFor={trial.value} 
              className="text-sm font-normal cursor-pointer inline"
            >
              {trial.label}
            </Label>
          </div>
        ))}
      </div>
      
      {/* {selectedTrials.length > 0 && (
        <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
          <strong>Selected Trials:</strong> {selectedTrials.map(trial => 
            currentTrials.find(t => t.value === trial)?.label
          ).join(', ')}
        </div>
      )} */}
    </div>
  );
};

export default TrialSelector;
