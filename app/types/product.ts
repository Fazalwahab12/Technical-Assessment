import type {Product, Image} from '@shopify/hydrogen/storefront-api-types';

export interface ProductCardProps {
  product: Product;
}

export interface ProductImageProps {
  image: Image | null | undefined;
  className?: string;
  sizes?: string;
}