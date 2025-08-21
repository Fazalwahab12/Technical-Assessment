import {Money} from '@shopify/hydrogen';
import type {ProductCardProps} from '~/types/product';
import {ProductImage} from './ProductImage';
import {useState} from 'react';

export function ProductCard({product}: ProductCardProps) {
  const [hoveredVariant, setHoveredVariant] = useState<number | null>(null);
  const [selectedVariant, setSelectedVariant] = useState(0);

  const currentVariant = product.variants.nodes[selectedVariant] || product.variants.nodes[0];
  const {priceV2: price, compareAtPriceV2: compareAtPrice} = currentVariant || {};
  
  // Get color variants from Shopify
  const colorVariants = product.variants.nodes.filter((variant) =>
    variant.selectedOptions?.some((option) => option.name.toLowerCase() === 'color')
  );

  // Get the image to display (either hovered or selected variant image)
  const displayVariant = hoveredVariant !== null ? colorVariants[hoveredVariant] : currentVariant;
  const displayImage = displayVariant?.image || product.featuredImage;

  // Check if product is on sale
  const isOnSale = compareAtPrice && price && 
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  return (
    <div className="bg-white max-w-xs group border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4">
      {/* Product Image */}
      <div className="w-full aspect-square overflow-hidden bg-gray-50 relative mb-4 border border-gray-100 rounded-lg">
        {/* Sale Badge */}
        {isOnSale && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              On Sale!
            </span>
          </div>
        )}

        {/* Product Image */}
        <ProductImage
          image={displayImage}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          sizes="320px"
        />
      </div>

      {/* Color Swatches */}
      {colorVariants.length > 0 && (
        <div className="flex gap-1.5 mb-4">
          {colorVariants.map((variant, index) => {
            const colorValue = variant.selectedOptions?.find(
              (option) => option.name.toLowerCase() === 'color'
            )?.value || '';

            // Get proper color from Shopify color name
            const getColorFromName = (colorName: string) => {
              if (!colorName) return '#6B7280';
              
              const name = colorName.toLowerCase();
              
              // Standard color mappings that match typical Shopify color values
              switch (name) {
                case 'blue': return '#3B82F6';
                case 'green': return '#22C55E';
                case 'navy': return '#1E3A8A';
                case 'pink': return '#EC4899';
                case 'yellow': return '#EAB308';
                case 'orange': return '#F97316';
                case 'red': return '#EF4444';
                case 'purple': return '#A855F7';
                case 'black': return '#000000';
                case 'white': return '#FFFFFF';
                case 'gray': case 'grey': return '#6B7280';
                case 'brown': return '#A3A3A3';
                case 'beige': return '#F5F5DC';
                case 'cream': return '#FFFDD0';
                default:
                  // For unknown colors, generate a consistent color based on the string
                  let hash = 0;
                  for (let i = 0; i < colorName.length; i++) {
                    hash = colorName.charCodeAt(i) + ((hash << 5) - hash);
                  }
                  const hue = Math.abs(hash) % 360;
                  return `hsl(${hue}, 65%, 50%)`;
              }
            };

            return (
              <button
                key={variant.id}
                onMouseEnter={() => setHoveredVariant(index)}
                onMouseLeave={() => setHoveredVariant(null)}
                onClick={() => setSelectedVariant(index)}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                  selectedVariant === index ? 'border-gray-800 shadow-sm' : 'border-gray-300'
                }`}
                style={{backgroundColor: getColorFromName(colorValue)}}
                title={colorValue}
              >
                {colorValue.toLowerCase() === 'white' && (
                  <div className="w-full h-full rounded-full border border-gray-200"></div>
                )}
              </button>
            );
          })}
        </div>
      )}

      
      {product.description && (
        <p className="text-xs text-gray-500 mb-2 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      )}
      {/* Product Title */}
      <h3 className="text-sm text-gray-900 mb-2 leading-tight font-medium">
        {product.title}
      </h3>

  
      

      {/* Product Price */}
      <div className="flex items-center gap-2">
        {/* Sale Price */}
        {price && (
          <span className={`text-sm font-semibold ${isOnSale ? 'text-red-500' : 'text-gray-900'}`}>
            <Money data={price} />
          </span>
        )}
        
        {/* Compare At Price (Original Price) */}
        {isOnSale && compareAtPrice && (
          <span className="text-xs text-gray-500 line-through">
            <Money data={compareAtPrice} />
          </span>
        )}
      </div>
    </div>
  );
}
