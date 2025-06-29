"use client";
import { BlockAttributes } from '@/types/blog';
import { getProductBySku, Product } from '@/data/products';

interface ProductShowcaseProps {
  attributes: BlockAttributes;
}

export default function ProductShowcase({ attributes }: ProductShowcaseProps) {
  const { name, image, products } = attributes;
  
  // Parse product SKUs and filter out undefined products
  const productSkus = products ? products.split(',').map(sku => sku.trim()) : [];
  const productData: Product[] = productSkus
    .map(sku => getProductBySku(sku))
    .filter((product): product is Product => product !== undefined);
  
  if (productData.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
        <p className="text-yellow-800 text-sm">
          No products found for the specified SKUs: {products}
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6">
      {/* Block Header */}
      <div className="flex items-center gap-3 mb-4">
        {image && (
          <img 
            src={image} 
            alt={name}
            className="w-8 h-8 rounded object-cover"
            onError={(e) => {
              e.currentTarget.src = '/file.svg';
            }}
          />
        )}
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
      </div>
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productData.map((product) => (
          <div 
            key={product.sku}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = '/file.svg';
                }}
              />
            </div>
            <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
            <p className="text-lg font-bold text-blue-600">{product.price}</p>
            <p className="text-xs text-gray-500 mt-1">SKU: {product.sku}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 