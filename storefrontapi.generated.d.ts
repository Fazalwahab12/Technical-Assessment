/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

export type ProductsQueryVariables = StorefrontAPI.Exact<{
  first: StorefrontAPI.Scalars['Int']['input'];
}>;

export type ProductsQuery = {
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'title'> & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
        >;
        variants: {
          nodes: Array<
            Pick<StorefrontAPI.ProductVariant, 'id' | 'title'> & {
              priceV2: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            }
          >;
        };
        options: Array<Pick<StorefrontAPI.ProductOption, 'name' | 'values'>>;
      }
    >;
  };
};

interface GeneratedQueryTypes {
  '#graphql\n  query Products($first: Int!) {\n    products(first: $first) {\n      nodes {\n        id\n        title\n        featuredImage {\n          id\n          url\n          altText\n          width\n          height\n        }\n        variants(first: 1) {\n          nodes {\n            id\n            title\n            priceV2 {\n              amount\n              currencyCode\n            }\n          }\n        }\n        options {\n          name\n          values\n        }\n      }\n    }\n  }\n': {
    return: ProductsQuery;
    variables: ProductsQueryVariables;
  };
}

declare module '@shopify/hydrogen' {
  interface StorefrontQueries extends GeneratedQueryTypes {}
}