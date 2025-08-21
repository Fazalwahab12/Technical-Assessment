import {Image} from '@shopify/hydrogen';
import type {ProductImageProps} from '~/types/product';

export function ProductImage({
  image,
  className = '',
  sizes = '(min-width: 45em) 50vw, 100vw',
}: ProductImageProps) {
  if (!image) {
    return (
      <div
        className={`product-image bg-gray-100 flex items-center justify-center ${className}`}
      >
        <span className="text-gray-400 text-sm">No image available</span>
      </div>
    );
  }

  return (
    <div className={`product-image overflow-hidden ${className}`}>
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="1/1"
        data={image}
        key={image.id}
        sizes={sizes}
        className="w-full h-full object-cover"
      />
    </div>
  );
}