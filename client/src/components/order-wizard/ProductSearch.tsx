
import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Plus, Minus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  category: string;
  material: string;
  description: string;
}

interface SelectedProduct extends Product {
  quantity: number;
}

const dummyProducts: Product[] = [
  { id: '1', name: 'Zirconia Crown', category: 'Crown', material: 'Zirconia', description: 'High-strength zirconia crown for posterior teeth' },
  { id: '2', name: 'E-max Crown', category: 'Crown', material: 'Lithium Disilicate', description: 'Esthetic lithium disilicate crown for anterior teeth' },
  { id: '3', name: 'PFM Crown', category: 'Crown', material: 'Porcelain Fused to Metal', description: 'Traditional porcelain fused to metal crown' },
  { id: '4', name: 'Zirconia Bridge 3-Unit', category: 'Bridge', material: 'Zirconia', description: '3-unit zirconia bridge for multiple tooth replacement' },
  { id: '5', name: 'E-max Veneer', category: 'Veneer', material: 'Lithium Disilicate', description: 'Ultra-thin esthetic veneer for smile enhancement' },
  { id: '6', name: 'Composite Veneer', category: 'Veneer', material: 'Composite Resin', description: 'Direct composite veneer for minor corrections' },
  { id: '7', name: 'Titanium Implant Crown', category: 'Implant', material: 'Titanium/Zirconia', description: 'Implant-supported crown with titanium abutment' },
  { id: '8', name: 'All-on-4 Prosthesis', category: 'Implant', material: 'Acrylic/Titanium', description: 'Full arch prosthesis supported by 4 implants' },
  { id: '9', name: 'Partial Denture', category: 'Prosthetics', material: 'Acrylic/Metal', description: 'Removable partial denture with metal framework' },
  { id: '10', name: 'Complete Denture', category: 'Prosthetics', material: 'Acrylic', description: 'Complete upper or lower denture' },
  { id: '11', name: 'Night Guard', category: 'Appliance', material: 'Acrylic', description: 'Custom night guard for bruxism protection' },
  { id: '12', name: 'Sports Guard', category: 'Appliance', material: 'EVA', description: 'Custom sports mouthguard for athletic protection' }
];

interface ProductSearchProps {
  selectedProducts?: SelectedProduct[];
  onProductsChange: (products: SelectedProduct[]) => void;
  selectedTeeth?: number[];
  restorationType?: 'separate' | 'joint' | 'bridge';
}

const ProductSearch = ({ selectedProducts = [], onProductsChange, selectedTeeth = [], restorationType }: ProductSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { toast } = useToast();

  // Calculate quantity based on restoration type
  const calculateQuantity = () => {
    if (!restorationType || selectedTeeth.length === 0) return 1;
    
    // For all restoration types, quantity is based on number of teeth selected
    return selectedTeeth.length;
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return dummyProducts;
    
    return dummyProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleProductSelect = (product: Product) => {
    // Check if product is already added
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    if (existingProduct) {
      toast({
        title: "Product already added",
        description: `${product.name} is already in your selection.`,
        variant: "destructive"
      });
      return;
    }

    // Add new product with calculated quantity
    const calculatedQuantity = calculateQuantity();
    const newProduct: SelectedProduct = { ...product, quantity: calculatedQuantity };
    onProductsChange([...selectedProducts, newProduct]);
    
    // Clear search
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    // For all restoration types, allow manual adjustment up to tooth count
    const maxQuantity = selectedTeeth.length;
    const minQuantity = 1;
    const finalQuantity = Math.max(minQuantity, Math.min(maxQuantity, newQuantity));
    
    const updatedProducts = selectedProducts.map(product =>
      product.id === productId ? { ...product, quantity: finalQuantity } : product
    );
    onProductsChange(updatedProducts);
  };

  const handleRemoveProduct = (productId: string) => {
    const updatedProducts = selectedProducts.filter(product => product.id !== productId);
    onProductsChange(updatedProducts);
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setIsDropdownOpen(value.length > 0);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Label className="text-sm font-medium mb-2 block">Product list *</Label>
        <div className="relative">
          <Input
            placeholder="Search and add products"
            value={searchTerm}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setIsDropdownOpen(searchTerm.length > 0 || true)}
            className="pl-8"
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        {/* Dropdown */}
        {isDropdownOpen && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto shadow-lg">
            <CardContent className="p-0">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleProductSelect(product)}
                  >
                    <div className="font-medium text-sm text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {product.category} • {product.material}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{product.description}</div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-sm text-gray-500 text-center">
                  No products found
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Selected Products */}
      {selectedProducts.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Selected Products ({selectedProducts.length})</Label>
          <div className="space-y-2">
            {selectedProducts.map((product) => (
              <Card key={product.id} className="border border-gray-200">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {product.category} • {product.material}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 ml-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleQuantityChange(product.id, product.quantity - 1)}
                          disabled={product.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium min-w-[2ch] text-center">
                          {product.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleQuantityChange(product.id, product.quantity + 1)}
                          disabled={product.quantity >= selectedTeeth.length}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveProduct(product.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Calculation Info */}
      {restorationType && selectedTeeth.length > 0 && (
        <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
          <strong>Quantity Logic:</strong> {selectedTeeth.length} units based on {selectedTeeth.length} selected teeth: {selectedTeeth.join(', ')}
          {restorationType !== 'separate' && (
            <div className="mt-1 text-xs text-gray-600">
              Note: {restorationType === 'bridge' ? 'Bridge' : 'Joint'} restoration covering multiple teeth
            </div>
          )}
        </div>
      )}

      {/* Validation Message */}
      {selectedProducts.length === 0 && (
        <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded border">
          Please add at least one product to continue.
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
