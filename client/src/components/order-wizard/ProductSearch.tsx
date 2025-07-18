import React, { useState, useMemo, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  restorationType?: "separate" | "joint" | "bridge";
  prescriptionType?: string;
  subcategoryType?: string;
}

const ProductSearch = ({
  selectedProducts = [],
  onProductsChange,
  selectedTeeth = [],
  restorationType,
  prescriptionType,
  subcategoryType,
}: ProductSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("All");

  // Click-away logic
  useEffect(() => {
    if (!isDropdownOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query parameters for filtering
        const queryParams = new URLSearchParams();
        if (prescriptionType) {
          queryParams.append("prescriptionType", prescriptionType);
        }
        if (subcategoryType) {
          queryParams.append("subcategoryType", subcategoryType);
        }

        const url = `/api/products${
          queryParams.toString() ? `?${queryParams.toString()}` : ""
        }`;
        const token = localStorage.getItem("token");
        const response = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch products"
        );
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast, prescriptionType, subcategoryType]);

  // Calculate quantity based on restoration type
  const calculateQuantity = () => {
    if (!restorationType || selectedTeeth.length === 0) return 1;

    // For these prescription types, quantity is based on arch selection
    const archBasedPrescriptionTypes = [
      "splints-guards",
      "ortho",
      "dentures",
      "sleep-accessories",
    ];

    if (archBasedPrescriptionTypes.includes(prescriptionType || "")) {
      // Calculate quantity based on arch selection
      const upperArchTeeth = [
        11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28,
      ];
      const lowerArchTeeth = [
        31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48,
      ];

      const hasUpperTeeth = selectedTeeth.some((tooth) =>
        upperArchTeeth.includes(tooth)
      );
      const hasLowerTeeth = selectedTeeth.some((tooth) =>
        lowerArchTeeth.includes(tooth)
      );

      if (hasUpperTeeth && hasLowerTeeth) {
        return 2; // Both arches
      } else if (hasUpperTeeth || hasLowerTeeth) {
        return 1; // Single arch
      }
      return 1; // Default fallback
    }

    // For all other restoration types, quantity is based on number of teeth selected
    return selectedTeeth.length;
  };

  // Get unique materials from products
  const materialOptions = useMemo(() => {
    const mats = Array.from(new Set(products.map((p) => p.material)));
    return ["All", ...mats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (selectedMaterial !== "All") {
      filtered = filtered.filter(
        (product) => product.material === selectedMaterial
      );
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }
    return filtered;
  }, [searchTerm, products, selectedMaterial]);

  // Reset search term when material changes
  useEffect(() => {
    setSearchTerm("");
  }, [selectedMaterial]);

  const handleProductSelect = (product: Product) => {
    // Check if product is already added
    const existingProduct = selectedProducts.find((p) => p.id === product.id);
    if (existingProduct) {
      toast({
        title: "Product already added",
        description: `${product.name} is already in your selection.`,
        variant: "destructive",
      });
      return;
    }

    // Add new product with calculated quantity, append to previous selection
    const calculatedQuantity = calculateQuantity();
    const newProduct: SelectedProduct = {
      ...product,
      quantity: calculatedQuantity,
    };
    onProductsChange([...selectedProducts, newProduct]); // Allow multiple products
    // Clear search
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    // For all restoration types, allow manual adjustment up to tooth count
    const maxQuantity = selectedTeeth.length;
    const minQuantity = 1;
    const finalQuantity = Math.max(
      minQuantity,
      Math.min(maxQuantity, newQuantity)
    );

    const updatedProducts = selectedProducts.map((product) =>
      product.id === productId
        ? { ...product, quantity: finalQuantity }
        : product
    );
    onProductsChange(updatedProducts);
  };

  const handleRemoveProduct = (productId: string) => {
    const updatedProducts = selectedProducts.filter(
      (product) => product.id !== productId
    );
    onProductsChange(updatedProducts);
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setIsDropdownOpen(value.length > 0);
  };

  return (
    <div className="space-y-4" ref={containerRef}>
      <div className="relative">
        <div className="flex w-full justify-between items-center mb-2 gap-2">
          <Label className="text-sm font-medium block">Product list *</Label>
          <div className="min-w-[180px]">
            <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
              <SelectTrigger className="h-9 w-full border rounded px-2 text-sm">
                <SelectValue placeholder="Filter by Material" />
              </SelectTrigger>
              <SelectContent>
                {materialOptions.map((mat) => (
                  <SelectItem key={mat} value={mat}>
                    {mat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="relative">
          <Input
            placeholder={
              loading ? "Loading products..." : "Search and add products"
            }
            value={searchTerm}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setIsDropdownOpen(true)}
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
                    <div className="font-medium text-sm text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {product.category} • {product.material}
                    </div>
                    {product.description && (
                      <div className="text-xs text-gray-500 mt-1">
                        {product.description}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-3 text-sm text-gray-500 text-center">
                  {searchTerm ? "No products found" : "No products available"}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Selected Products */}
      {selectedProducts.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Selected Products</Label>
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
                      {/* Quantity Display */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1 bg-[#231F20] rounded-md border">
                          <span className="text-sm font-semibold text-[#07AD94]">
                            {product.quantity}
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
