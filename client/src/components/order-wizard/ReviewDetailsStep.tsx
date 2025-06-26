import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Search } from 'lucide-react';
import ToothSelector from './ToothSelector';

interface ReviewDetailsStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

interface Product {
  id: string;
  name: string;
  category: string;
  material: string;
  description?: string;
  quantity: number;
}

const ReviewDetailsStep = ({ formData, setFormData }: ReviewDetailsStepProps) => {
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>(formData.selectedTeeth || [11, 15, 23]);
  const [restorationType, setRestorationType] = useState<'separate' | 'joint' | 'bridge'>('joint');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([
    { id: '1', name: 'E-max Crown', category: 'Crown', material: 'Lithium Disilicate', quantity: 1 },
    { id: '2', name: 'Night Guard', category: 'Appliance', material: 'Acrylic', quantity: 1 }
  ]);
  const [productSearch, setProductSearch] = useState('');
  const [shade, setShade] = useState('A3 - Vita Classic');
  const [occlusalStaining, setOcclusalStaining] = useState('Light');
  const [notes, setNotes] = useState('Everything is Good');
  // Transform database tooth groups to match ToothSelector interface
  const transformDatabaseToothGroups = (dbGroups: any[]) => {
    return dbGroups.map((group: any) => ({
      groupId: group.groupId || `group-${group.id}`,
      teeth: Array.isArray(group.teeth) ? group.teeth : [group.teeth],
      type: group.type === 'individual' ? 'separate' : 
            group.type === 'connected' ? 'joint' : 
            group.type || 'separate',
      productType: group.productType || 'crown-bridge',
      material: group.material || '',
      shade: group.shade || '',
      notes: group.notes || '',
      occlusalStaining: group.occlusalStaining || 'medium',
      ponticDesign: group.ponticDesign || '',
      products: group.products || []
    }));
  };

  const [toothGroups, setToothGroups] = useState(() => {
    // If we have tooth groups from formData (repeat order), transform them
    if (formData.toothGroups && formData.toothGroups.length > 0) {
      return transformDatabaseToothGroups(formData.toothGroups);
    }
    
    // Default tooth group for new orders
    return [{
      groupId: 'current',
      teeth: selectedTeeth,
      type: restorationType,
      productType: 'crown-bridge' as const,
      material: 'E-max Crown, Night Guard',
      shade: shade,
      notes: notes,
      occlusalStaining: occlusalStaining,
      products: [
        { id: '1', name: 'E-max Crown', category: 'Crown', material: 'Lithium Disilicate', description: 'E-max Crown', quantity: 1 },
        { id: '2', name: 'Night Guard', category: 'Appliance', material: 'Acrylic', description: 'Night Guard', quantity: 1 }
      ]
    }];
  });

  const availableProducts = [
    { id: '3', name: 'Zirconia Crown', category: 'Crown', material: 'Zirconia', price: '$250' },
    { id: '4', name: 'Porcelain Crown', category: 'Crown', material: 'Porcelain', price: '$300' },
    { id: '5', name: 'Metal Crown', category: 'Crown', material: 'Gold', price: '$400' },
    { id: '6', name: 'Ceramic Veneer', category: 'Veneer', material: 'Ceramic', price: '$350' },
    { id: '7', name: 'Composite Filling', category: 'Filling', material: 'Composite', price: '$150' }
  ];

  const filteredProducts = availableProducts.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleToothClick = (toothNumber: number) => {
    setSelectedTeeth(prev => {
      if (prev.includes(toothNumber)) {
        return prev.filter(t => t !== toothNumber);
      } else {
        return [...prev, toothNumber];
      }
    });
  };

  const updateProductQuantity = (productId: string, change: number) => {
    setSelectedProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const newQuantity = Math.max(1, product.quantity + change);
        return { ...product, quantity: newQuantity };
      }
      return product;
    }));
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const addProduct = (product: any) => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: product.name,
      category: product.category,
      material: product.material,
      quantity: 1
    };
    setSelectedProducts(prev => [...prev, newProduct]);
  };

  const completeProductGroup = () => {
    setFormData({
      ...formData,
      selectedTeeth,
      restorationType,
      selectedProducts,
      shade,
      occlusalStaining,
      notes,
      reviewCompleted: true
    });
  };

  const handleGroupsChange = (groups: any[]) => {
    setToothGroups(groups);
    if (groups.length > 0) {
      const group = groups[0];
      setSelectedTeeth(group.teeth);
      setRestorationType(group.type);
      setShade(group.shade || 'A3 - Vita Classic');
      setNotes(group.notes || '');
      setOcclusalStaining(group.occlusalStaining || 'Light');
      if (group.products) {
        setSelectedProducts(group.products.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          material: p.material,
          quantity: p.quantity
        })));
      }
      setFormData({
        ...formData,
        selectedTeeth: group.teeth,
        restorationType: group.type,
        shade: group.shade,
        notes: group.notes,
        toothGroups: groups
      });
    }
  };

  return (
    <div className="space-y-6">
      <ToothSelector 
        selectedGroups={toothGroups}
        onGroupsChange={handleGroupsChange}
        onProductComplete={completeProductGroup}
      />

    </div>
  );
};

export default ReviewDetailsStep;