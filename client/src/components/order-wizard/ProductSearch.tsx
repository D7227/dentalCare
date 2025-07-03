import React, { useState, useMemo, useEffect } from 'react';
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

interface ProductSearchProps {
  selectedProducts?: SelectedProduct[];
  onProductsChange: (products: SelectedProduct[]) => void;
  selectedTeeth?: number[];
  restorationType?: 'separate' | 'joint' | 'bridge';
}

const ProductSearch = ({ selectedProducts = [], onProductsChange, selectedTeeth = [], restorationType }: ProductSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  // Calculate quantity based on restoration type
  const calculateQuantity = () => {
    if (!restorationType || selectedTeeth.length === 0) return 1;
    
    // For all restoration types, quantity is based on number of teeth selected
    return selectedTeeth.length;
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, products]);

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

    // Add new product with calculated quantity, replacing any previous selection
    const calculatedQuantity = calculateQuantity();
    const newProduct: SelectedProduct = { ...product, quantity: calculatedQuantity };
    onProductsChange([newProduct]); // Only allow one product at a time
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
            placeholder={loading ? "Loading products..." : "Search and add products"}
            value={searchTerm}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setIsDropdownOpen(searchTerm.length > 0 || true)}
            className="pl-8"
            disabled={loading}
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        {/* Dropdown */}
        {isDropdownOpen && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto shadow-lg">
            <CardContent className="p-0">
              {loading ? (
                <div className="p-3 text-sm text-gray-500 text-center">
                  Loading products...
                </div>
              ) : error ? (
                <div className="p-3 text-sm text-red-500 text-center">
                  {error}
                </div>
              ) : filteredProducts.length > 0 ? (
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
                    {product.description && (
                      <div className="text-xs text-gray-500 mt-1">{product.description}</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-3 text-sm text-gray-500 text-center">
                  {searchTerm ? 'No products found' : 'No products available'}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Selected Products */}
      {selectedProducts.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Selected Product</Label>
          <div className="space-y-2">
            {/* Only show the first selected product */}
            <Card key={selectedProducts[0].id} className="border border-gray-200">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {selectedProducts[0].name}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {selectedProducts[0].category} • {selectedProducts[0].material}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    {/* Quantity Display */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-3 py-1 bg-[#231F20] rounded-md border">
                        <span className="text-sm font-semibold text-[#07AD94]">
                          {selectedProducts[0].quantity}
                        </span>
                        <span className="text-xs text-[#FFFFFF] font-medium">
                          Units
                        </span>
                      </div>
                    </div>
                    {/* Remove Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onProductsChange([])}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Quantity Calculation Info */}
      {/* {restorationType && selectedTeeth.length > 0 && (
        <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
          <strong>Quantity Logic:</strong> {selectedTeeth.length} units based on {selectedTeeth.length} selected teeth: {selectedTeeth.join(', ')}
          {restorationType !== 'separate' && (
            <div className="mt-1 text-xs text-gray-600">
              Note: {restorationType === 'bridge' ? 'Bridge' : 'Joint'} restoration covering multiple teeth
            </div>
          )}
        </div>
      )} */}

      {/* Validation Message */}
      {/* {selectedProducts.length === 0 && (
        <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded border">
          Please add at least one product to continue.
        </div>
      )} */}
    </div>
  );
};

export default ProductSearch;
