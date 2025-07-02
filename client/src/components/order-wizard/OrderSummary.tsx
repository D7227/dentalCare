import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, CheckCircle, Plus, FileChartColumnIncreasing, User, ArchiveRestore, Wrench, FileText } from 'lucide-react';
import { OrderCategory } from './types/orderTypes';
import ToothChart from './components/ToothChart';
import { DoctorInfo } from '../shared/DoctorInfo';
import { ToothSummary } from '../shared/ToothSummary';
import { CrownBridgeTeeth, ImpantTeeth } from '@/assets/svg';

interface OrderSummaryProps {
  formData: any;
  orderCategory: OrderCategory;
  onEditSection?: (step: number) => void;
}

// Helper to build deduplicated, prioritized group list for summary
function buildSummaryGroups(toothGroups: any[], selectedTeeth: any[]) {
  // Priority: bridge > joint > individual
  const usedTeeth = new Set<number>();
  const summaryGroups: any[] = [];

  // Add bridge groups first, but only if teeth are not in selectedTeeth
  toothGroups.filter(g => g.type === 'bridge').forEach(group => {
    const teeth = group.teeth.filter((t: number) => !usedTeeth.has(t) && !selectedTeeth.some((st: any) => st.toothNumber === t));
    if (teeth.length > 0) {
      summaryGroups.push({ ...group, teeth });
      teeth.forEach((t: number) => usedTeeth.add(t));
    }
  });
  // Then joint groups, but only if teeth are not in selectedTeeth
  toothGroups.filter(g => g.type === 'joint').forEach(group => {
    const teeth = group.teeth.filter((t: number) => !usedTeeth.has(t) && !selectedTeeth.some((st: any) => st.toothNumber === t));
    if (teeth.length > 0) {
      summaryGroups.push({ ...group, teeth });
      teeth.forEach((t: number) => usedTeeth.add(t));
    }
  });
  // Then individual teeth
  const individualTeeth = selectedTeeth.filter((t: any) => !usedTeeth.has(t.toothNumber));
  if (individualTeeth.length > 0) {
    summaryGroups.push({
      groupId: 'individual-group',
      teeth: individualTeeth.map((t: any) => t.toothNumber),
      type: 'individual',
      material: '',
      shade: '',
      notes: '',
    });
    individualTeeth.forEach((t: any) => usedTeeth.add(t.toothNumber));
  }
  return summaryGroups;
}

// Helper for summary getToothType
function getSummaryToothType(toothNumber: number, summaryGroups: any[], selectedTeeth: any[]) {
  // Check bridge and joint groups first
  for (const group of summaryGroups) {
    if (group.type === 'bridge' || group.type === 'joint') {
      if (group.teeth.includes(toothNumber)) {
        if (group.pontics && group.pontics.includes(toothNumber)) return 'pontic';
        return 'abutment';
      }
    }
  }
  // Then check individual
  const ind = selectedTeeth.find((t: any) => t.toothNumber === toothNumber);
  if (ind) return ind.type;
  return null;
}

const OrderSummary = ({ formData, orderCategory, onEditSection }: OrderSummaryProps) => {
  const getCategoryTitle = () => {
    switch (orderCategory) {
      case 'new': return 'Review & Submit Order';
      case 'repeat': return 'Review & Submit Repeat Order';
      case 'repair': return 'Review & Submit Repair Request';
      default: return 'Review & Submit Order';
    }
  };

  const getCategoryColor = () => {
    switch (orderCategory) {
      case 'new': return 'bg-emerald-100 text-emerald-800';
      case 'repeat': return 'bg-blue-100 text-blue-800';
      case 'repair': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const EditButton = ({ onClick, label }: { onClick?: () => void; label: string }) => (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className="text-primary hover:bg-primary/10 print:hidden h-8 px-2 max-w-min"
    >
      <Edit2 size={12} className="mr-1" />
      Edit
    </Button>
  );

  // Group restoration data by teeth groups
  const restorationGroups = buildSummaryGroups(formData.toothGroups || [], formData.selectedTeeth || []);

  let allGroups = [...formData.toothGroups];
  if (formData.selectedTeeth.length > 0) {
    allGroups.push({
      groupId: 'individual-group',
      teeth: formData.selectedTeeth.map((t: any) => t.toothNumber),
      type: 'individual',
      material: '',
      shade: '',
      notes: '',
    });
  }

  const isGroupConfigured = (group: any) => {
    if (group.groupId === 'individual-group') {
      // Check if all individual teeth have products configured
      const individualTeeth = (formData.selectedTeeth || []).filter((t: any) => group.teeth.includes(t.toothNumber));
      return individualTeeth.length > 0 && individualTeeth.every((t: any) => t.selectedProducts && t.selectedProducts.length > 0);
    }
    return group.selectedProducts &&
      group.selectedProducts.length > 0 &&
      group.productDetails;
  };

  const unconfiguredGroups = allGroups.filter((group: any) => !isGroupConfigured(group));
  return (
    <div className="max-w-6xl mx-auto space-y-6 print:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-center w-full">
          <h1 className="text-2xl font-bold text-gray-900 print:text-xl">Review and Submit Order</h1>
        </div>
      </div>
      <div className="flex gap-3">
        {/* Left: Tooth Chart with Quadrant Labels */}
        <div className="space-y-4 print:space-y-3">
          <Card className="border-2 border-dashed border-green-300 bg-green-50 w-[350px]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-green-700">
                  Adding: {formData.restorationType ?
                    formData.restorationType.charAt(0).toUpperCase() + formData.restorationType.slice(1) :
                    'Crown'} & Bridge
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onEditSection?.(2)}
                  className="text-green-600 border-green-300 hover:bg-green-100 print:hidden h-7 px-2 text-xs"
                >
                  Change
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ToothChart
                selectedGroups={formData.toothGroups || []}
                selectedTeeth={formData.selectedTeeth || []}
                onToothClick={() => { }}
                isToothSelected={() => false}
                getToothType={(toothNumber) => getSummaryToothType(toothNumber, restorationGroups, formData.selectedTeeth || [])}
                onGroupsChange={() => { }}
                setSelectedTeeth={() => { }}
                onDragConnection={() => { }}
              />
            </CardContent>
          </Card>
          {/* Accessories */}
          <Card className="shadow-sm w-[350px] p-3">
            <CardHeader className=" print:pb-2 p-0 pb-3">
              <div className="flex items-center justify-between">
                <div className='flex items-center gap-2'>
                  <div className="p-2 border bg-[#1D4ED826] text-[#1D4ED8] h-[32px] w-[32px] rounded-[6px]">
                    <Wrench className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-gray-900">Accessories</CardTitle>
                </div>
                <div className='h-8 w-8 text-center border border-[#DEDDDD] rounded-sm flex items-center justify-center'>
                  <Edit2 size={12} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2 print:space-y-1 p-0">
              {formData.accessories ? (
                <div className="space-y-1">
                  {Object.entries(formData.accessories).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 text-base">{value}</span>
                      <span className="text-gray-900 capitalize text-base">{key.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">No accessories selected</div>
              )}
            </CardContent>
          </Card>
        </div>


        {/* Right: Stacked Info Cards */}
        <div className="flex-1 space-y-4 print:space-y-3">
          {/* Case Details */}
          <Card className="shadow-sm p-3">
            <CardHeader className="print:pb-2 p-0 pb-3">
              <div className="flex items-center justify-between">
                <div className='flex items-center gap-2'>
                  <div className="p-2 border bg-[#1D4ED826] text-[#1D4ED8] h-[32px] w-[32px] rounded-[6px]">
                    <User className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-gray-900">Case Details</CardTitle>
                </div>
                <div className='h-8 w-8 text-center border border-[#DEDDDD] rounded-sm flex items-center justify-center'>
                  <Edit2 size={12} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2 print:space-y-1 p-0">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className='flex-1'>
                  <div className="text-xs text-gray-500">Consulting Doctor</div>
                  <div className="font-medium text-gray-900">{formData.consultingDoctor || '-'}</div>
                </div>
                <div className='flex-1'>
                  <div className="text-xs text-gray-500">Case Handled By</div>
                  <div className="font-medium text-gray-900">{formData.caseHandledBy || '-'}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className='flex-1'>
                  <div className="text-xs text-gray-500">Patient Name</div>
                  <div className="font-medium text-gray-900">{formData.firstName || formData.patientFirstName} {formData.lastName || formData.patientLastName || '-'}</div>
                </div>
                <div className='flex-1'>
                  <div className="text-xs text-gray-500">Age</div>
                  <div className="font-medium text-gray-900">{formData.age || formData.patientAge || '-'}</div>
                </div>
                <div className='flex-1'>
                  <div className="text-xs text-gray-500">Gender</div>
                  <div className="font-medium text-gray-900">{formData.sex || formData.patientSex || '-'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Restoration & Treatment Details */}
          <Card className="shadow-sm p-3">
            <CardHeader className="pb-3 print:pb-2 mb-4 p-0">
              <div className="flex items-center justify-between">
                <div className='flex items-center gap-2'>
                  <div className="p-2 border bg-[#0B804326] text-[#0B8043] h-[32px] w-[32px] rounded-[6px]">
                    <ArchiveRestore className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-gray-900">Restoration & Treatment Details</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 print:space-y-1 p-0">
              <div className="text-xs text-gray-500">Type of Restoration</div>
              <div className='flex items-center gap-2'>
                <div className="w-7 h-7 bg-teal-500 rounded-[6px] flex items-center justify-center flex-shrink-0">
                  {formData.category === "implant" ? (
                    <img src={ImpantTeeth} alt="CrownBridgeTeeth" />
                  ) : (
                    <img src={CrownBridgeTeeth} alt="CrownBridgeTeeth" />
                  )}
                </div>
                <div className='font-medium text-gray-900'>{formData.restorationType || 'Crown'}</div>
              </div>
              <div className="text-xs text-gray-500 mt-4 mb-1">Teeth</div>
              {allGroups.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  {allGroups.map((group: any, index: number) => {
                    return (
                      <div key={index} className={`flex border h-fit items-center px-3 py-2 text-white ${group.type === 'individual' ? 'bg-[#1D4ED8] border-[#4574F9]' : group.type === 'joint' ? 'bg-[#0B8043] border-[#10A457]' : 'bg-[#EA580C] border-[#FF7730]'} rounded-lg w-fit`}>
                        <span className="text-xs text-[10px]">{group.type}:</span>
                        <span className=" ml-2 text-[10px]">
                          {group.teeth?.join(', ')}
                        </span>
                        {/* <span className="text-orange-600 text-sm">Pending</span> */}
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="flex flex-wrap mt-4">
                <div className='flex-1 gap-2'>
                  <div className="text-[12px] text-gray-500">Product Selection</div>
                  <div className="font-medium text-gray-900 text-xs">
                    {Array.isArray(formData.restorationProducts) && formData.restorationProducts.length > 0 ? (
                      formData.restorationProducts.map((product: any, idx: number) => (
                        <span key={idx}>{product.product}{idx < formData.restorationProducts.length - 1 ? ', ' : ''}</span>
                      ))
                    ) : '-'}
                  </div>
                </div>
                <div className='flex-1 gap-2'>
                  <div className="text-[12px] text-gray-500">Pontic</div>
                  <div className="font-medium text-gray-900 text-xs">{formData.pontic || '-'}</div>
                </div>
              </div>
              <div className='flex flex-wrap mt-4'>
                <div className='flex-1 gap-2'>
                  <div className="text-[12px] text-gray-500">Trial</div>
                  <div className="font-medium text-gray-900 text-xs">{formData.trial || '-'} Trial</div>
                </div>
                <div className='flex-1 gap-2'>
                  <div className="text-[12px] text-gray-500">Occlusal Staining</div>
                  <div className="font-medium text-gray-900 text-xs">{formData.occlusalStaining || '-'}</div>
                </div>
              </div>
              <div className='mt-4'>
                <div className="text-[12px] text-gray-500">Shade</div>
                <div className="font-medium text-gray-900 text-xs">{formData.shade || '—'}</div>
              </div>
            </CardContent>
          </Card>
          {/* File Upload Summary */}
          <Card className="shadow-sm p-3">
            <CardHeader className=" print:pb-2 p-0 pb-3">
              <div className="flex items-center justify-between">
                <div className='flex items-center gap-2'>
                  <div className="p-2 border bg-[#A1620726] text-[#A16207] border-[#A16207] h-[32px] w-[32px] rounded-[6px]">
                    <FileText  className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-gray-900">File Upload Summary</CardTitle>
                </div>
                <div className='h-8 w-8 text-center border border-[#DEDDDD] rounded-sm flex items-center justify-center'>
                  <Edit2 size={12} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2 print:space-y-1 p-0">
              {formData.files?.length > 0 ? (
                <div className="space-y-1">
                  {formData.files.map((file: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-gray-900">{file.name}</span>
                      <span className="text-gray-600">{(file.size / (1024 * 1024)).toFixed(2)} Mb</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">No files uploaded</div>
              )}
            </CardContent>
          </Card>



        </div>
      </div>
      {/* Confirmation/Info Box */}
      {/* Additional Notes */}
      <Card className="shadow-sm mb-3 p-3">
        <CardHeader className="pb-3 print:pb-2 p-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-900">Additional Notes</CardTitle>
            <EditButton onClick={() => onEditSection?.(5)} label="Notes" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded min-h-[40px]">
            {formData.notes || <span className="italic text-gray-400">No additional notes</span>}
          </div>
        </CardContent>
      </Card>
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 print:p-3 print:bg-transparent print:border-gray-300">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 print:h-4 print:w-4" />
          <div>
            <p className="text-emerald-800 font-medium text-sm print:text-xs">
              Please review all details carefully before submitting your {orderCategory} request.
            </p>
            <p className="text-emerald-700 text-xs mt-1 print:hidden">
              Once submitted, the lab will begin processing your order according to the specified requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;