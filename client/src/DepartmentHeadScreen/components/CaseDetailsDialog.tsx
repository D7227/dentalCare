import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Download, Plus, MessageSquare } from 'lucide-react';

interface CaseDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCaseDetails: any;
  newProductName: string;
  setNewProductName: (v: string) => void;
  newProductQuantity: number;
  setNewProductQuantity: (v: number) => void;
  newProductCost: number;
  setNewProductCost: (v: number) => void;
  newAccessoryName: string;
  setNewAccessoryName: (v: string) => void;
  newAccessoryQuantity: number;
  setNewAccessoryQuantity: (v: number) => void;
  newAccessoryProvider: 'lab' | 'doctor';
  setNewAccessoryProvider: (v: 'lab' | 'doctor') => void;
  newAccessoryNotes: string;
  setNewAccessoryNotes: (v: string) => void;
  handleDownloadFile: (file: any) => void;
  handleAddProduct: () => void;
  handleAddAccessory: () => void;
  handleChatOpen: (caseNumber: string, caseType: string) => void;
  setIsCaseDetailsOpen: (open: boolean) => void;
}

const CaseDetailsDialog: React.FC<CaseDetailsDialogProps> = ({
  open,
  onOpenChange,
  selectedCaseDetails,
  newProductName,
  setNewProductName,
  newProductQuantity,
  setNewProductQuantity,
  newProductCost,
  setNewProductCost,
  newAccessoryName,
  setNewAccessoryName,
  newAccessoryQuantity,
  setNewAccessoryQuantity,
  newAccessoryProvider,
  setNewAccessoryProvider,
  newAccessoryNotes,
  setNewAccessoryNotes,
  handleDownloadFile,
  handleAddProduct,
  handleAddAccessory,
  handleChatOpen,
  setIsCaseDetailsOpen,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Case Details - {selectedCaseDetails?.caseNumber}
          <Badge variant="outline" className="text-xs">
            {selectedCaseDetails?.caseType}
          </Badge>
        </DialogTitle>
      </DialogHeader>

      {selectedCaseDetails && (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Patient Information</h3>
              <p>
                <strong>Name:</strong> {selectedCaseDetails.patientName}
              </p>
              <p>
                <strong>Doctor:</strong> {selectedCaseDetails.doctorName}
              </p>
              <p>
                <strong>Clinic:</strong> {selectedCaseDetails.clinicName}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Case Information</h3>
              <p>
                <strong>Type:</strong> {selectedCaseDetails.caseType}
              </p>
              <p>
                <strong>Priority:</strong> {selectedCaseDetails.priority}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                {selectedCaseDetails.status || 'Waiting'}
              </p>
            </div>
          </div>

          {/* Notes */}
          {selectedCaseDetails.notes && (
            <div>
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-sm bg-gray-50 p-3 rounded">
                {selectedCaseDetails.notes}
              </p>
            </div>
          )}

          {/* Case Logs */}
          <div>
            <h3 className="font-semibold mb-2">Case Logs</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {selectedCaseDetails.logs.map((log: any) => (
                <div
                  key={log.id}
                  className="text-sm bg-gray-50 p-2 rounded"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{log.action}</span>
                    <span className="text-gray-500">{log.timestamp}</span>
                  </div>
                  <p className="text-gray-600">
                    {log.details} - {log.user}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Digital Files */}
          <div>
            <h3 className="font-semibold mb-2">Digital Files</h3>
            {selectedCaseDetails.digitalFiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedCaseDetails.digitalFiles.map((file: any) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {file.type} • {file.size}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadFile(file)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No digital files available</p>
            )}
          </div>

          {/* Products */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Products</h3>
            </div>

            {/* Add Product Form */}
            <div className="bg-gray-50 p-3 rounded mb-3">
              <h4 className="text-sm font-medium mb-2">Add Product</h4>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Product name"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={newProductQuantity}
                  onChange={(e) => setNewProductQuantity(Number(e.target.value))}
                />
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Cost"
                    value={newProductCost}
                    onChange={(e) => setNewProductCost(Number(e.target.value))}
                  />
                  <Button onClick={handleAddProduct} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products List */}
            {selectedCaseDetails.products.length > 0 ? (
              <div className="space-y-2">
                {selectedCaseDetails.products.map((product: any) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between bg-white border p-2 rounded"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {product.quantity} • Cost: ₹{product.cost}
                      </p>
                    </div>
                    <Badge variant="secondary">{product.addedBy}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No products added</p>
            )}
          </div>

          {/* Accessories */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Accessories</h3>
            </div>

            {/* Add Accessory Form */}
            <div className="bg-gray-50 p-3 rounded mb-3">
              <h4 className="text-sm font-medium mb-2">Add Accessory</h4>
              <div className="grid grid-cols-4 gap-2">
                <Input
                  placeholder="Accessory name"
                  value={newAccessoryName}
                  onChange={(e) => setNewAccessoryName(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={newAccessoryQuantity}
                  onChange={(e) => setNewAccessoryQuantity(Number(e.target.value))}
                />
                <select
                  className="border rounded px-2 py-1"
                  value={newAccessoryProvider}
                  onChange={(e) => setNewAccessoryProvider(e.target.value as 'lab' | 'doctor')}
                >
                  <option value="lab">Lab</option>
                  <option value="doctor">Doctor</option>
                </select>
                <div className="flex gap-2">
                  <Input
                    placeholder="Notes"
                    value={newAccessoryNotes}
                    onChange={(e) => setNewAccessoryNotes(e.target.value)}
                  />
                  <Button onClick={handleAddAccessory} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Accessories List */}
            {selectedCaseDetails.accessories.length > 0 ? (
              <div className="space-y-2">
                {selectedCaseDetails.accessories.map((accessory: any) => (
                  <div
                    key={accessory.id}
                    className="flex items-center justify-between bg-white border p-2 rounded"
                  >
                    <div>
                      <p className="font-medium">{accessory.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {accessory.quantity}
                      </p>
                      {accessory.notes && (
                        <p className="text-xs text-gray-400">
                          {accessory.notes}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={
                        accessory.providedBy === 'lab' ? 'default' : 'secondary'
                      }
                    >
                      {accessory.providedBy === 'lab' ? 'By Lab' : 'By Doctor'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No accessories added</p>
            )}
          </div>

          {/* Chat for Approvals */}
          <div className="bg-blue-50 p-3 rounded">
            <h4 className="text-sm font-medium mb-2">Need Approval?</h4>
            <p className="text-sm text-gray-600 mb-2">
              Use chat to request approval for changes or additions to this
              case.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsCaseDetailsOpen(false);
                handleChatOpen(
                  selectedCaseDetails.caseNumber,
                  selectedCaseDetails.caseType
                );
              }}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Request Approval
            </Button>
          </div>
        </div>
      )}
    </DialogContent>
  </Dialog>
);

export default CaseDetailsDialog; 