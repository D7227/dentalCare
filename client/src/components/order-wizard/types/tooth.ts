export interface ToothDetail {
  teethNumber: number;
  productName: string[];
  productQuantity: number;
  shadeDetails: string;
  occlusalStaining: string;
  shadeGuide: string[];
  shadeNotes: string;
  trialRequirements: string;
  type: 'abutment' | 'pontic';
}

export interface ToothGroup {
  groupType: 'bridge' | 'joint' | 'separate' | 'individual';
  teethDetails: ToothDetail[][];
}

// Legacy interface for backward compatibility
export interface LegacyToothGroup {
  groupId: string;
  teeth: number[];
  type: 'separate' | 'joint' | 'bridge' | 'individual';
  productType: 'implant' | 'crown-bridge';
  notes: string;
  material: string;
  shade: string;
  pontics?: number[];
  warning?: string;
  occlusalStaining?: string;
  ponticDesign?: string;
  trial?: string;
  selectedTrials?: string[];
  products?: Array<{
    id: string;
    name: string;
    category: string;
    material: string;
    description: string;
    quantity: number;
  }>;
}
