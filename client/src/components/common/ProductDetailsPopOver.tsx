import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface Product {
  product?: string;
  name?: string;
  quantity?: number;
  material?: string;
  shade?: string;
  [key: string]: any;
}

interface ProductDetailsPopOverProps {
  products: Product[];
  trigger?: React.ReactNode;
  triggerText?: string;
}

const ProductDetailsPopOver: React.FC<ProductDetailsPopOverProps> = ({
  products,
  trigger,
  triggerText,
}) => {
  if (!products || products.length === 0) {
    return <span className="text-gray-400">No products</span>;
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <button className="font-medium focus:outline-none">
            {triggerText ||
              (products.length === 1
                ? `${products[0].product || products[0].name} x ${
                    products[0].qty
                  }`
                : `${products[0].product || products[0].name} x ${
                    products[0].qty
                  } +${products.length - 1} more`)}
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="font-semibold mb-2">Product Details</div>
        <ul className="space-y-1">
          {products.map((prod, idx) => (
            <li
              key={idx}
              className="flex flex-col border-b last:border-b-0 pb-1 last:pb-0 text-sm"
            >
              <div className="flex justify-between">
                <span>{prod.product || prod.name}</span>
                <span className="text-gray-500">x{prod.qty}</span>
              </div>
              {prod.material && (
                <div className="text-xs text-gray-500">
                  Material: {prod.material}
                </div>
              )}
              {prod.shade && (
                <div className="text-xs text-gray-500">Shade: {prod.shade}</div>
              )}
              {/* Add more fields as needed */}
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default ProductDetailsPopOver;
