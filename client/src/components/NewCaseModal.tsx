
import React, { useState } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (caseData: any) => void;
}

const NewCaseModal = ({ isOpen, onClose, onSubmit }: NewCaseModalProps) => {
  const [formData, setFormData] = useState({
    patientName: '',
    caseType: '',
    notes: '',
    accessories: {
      biteBlock: false,
      trays: false,
      mockups: false,
    },
    requestTrial: false,
    returnAccessories: false,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container modal-lg">
        <div className="modal-header">
          <h2 className="modal-title">New Case Submission</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close modal" className="btn-ghost hover-lift focus-ring">
            <X size={20} />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-grid">
            <div className="form-field">
              <Label htmlFor="patientName" className="form-label">Patient Name</Label>
              <Input
                id="patientName"
                value={formData.patientName}
                onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                placeholder="Enter patient name"
                className="input-field"
                required
              />
            </div>
            
            <div className="form-field">
              <Label htmlFor="caseType" className="form-label">Case Type</Label>
              <Select onValueChange={(value) => setFormData({...formData, caseType: value})}>
                <SelectTrigger className="input-field">
                  <SelectValue placeholder="Select case type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crown">Crown</SelectItem>
                  <SelectItem value="bridge">Bridge</SelectItem>
                  <SelectItem value="denture">Denture</SelectItem>
                  <SelectItem value="implant">Implant</SelectItem>
                  <SelectItem value="orthodontic">Orthodontic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="form-field">
            <Label htmlFor="notes" className="form-label">Case Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Add any special instructions or notes..."
              className="input-field"
              rows={4}
            />
          </div>
          
          <div className="form-field">
            <Label className="form-label">File Upload</Label>
            <div className="upload-zone">
              <Upload className="upload-icon" size={24} />
              <p className="upload-text">
                Drop files here or <span className="upload-link">browse</span>
              </p>
              <p className="upload-hint">
                Supports: JPG, PNG, PDF, STL (Max 10MB)
              </p>
            </div>
          </div>
          
          <div className="form-field">
            <Label className="form-label">Required Accessories</Label>
            <div className="checkbox-grid">
              {Object.entries({
                biteBlock: 'Bite Block',
                trays: 'Impression Trays',
                mockups: 'Mockups'
              }).map(([key, label]) => (
                <div key={key} className="checkbox-item">
                  <Checkbox
                    id={key}
                    checked={formData.accessories[key as keyof typeof formData.accessories]}
                    onCheckedChange={(checked) => 
                      setFormData({
                        ...formData, 
                        accessories: {...formData.accessories, [key]: checked}
                      })
                    }
                  />
                  <Label htmlFor={key} className="checkbox-label">{label}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="checkbox-group">
            <div className="checkbox-item">
              <Checkbox
                id="requestTrial"
                checked={formData.requestTrial}
                onCheckedChange={(checked) => setFormData({...formData, requestTrial: !!checked})}
              />
              <Label htmlFor="requestTrial" className="checkbox-label">Request trial work before final</Label>
            </div>
            
            <div className="checkbox-item">
              <Checkbox
                id="returnAccessories"
                checked={formData.returnAccessories}
                onCheckedChange={(checked) => setFormData({...formData, returnAccessories: !!checked})}
              />
              <Label htmlFor="returnAccessories" className="checkbox-label">Return original accessories</Label>
            </div>
          </div>
          
          <div className="modal-footer">
            <Button type="button" variant="outline" onClick={onClose} className="btn-outline">
              Cancel
            </Button>
            <Button type="submit" variant="default" className="btn-primary">
              Submit Case
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCaseModal;
