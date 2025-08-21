import {type MetaFunction, json, type LoaderFunctionArgs} from '@remix-run/node';
import {useLoaderData} from '@remix-run/react';
import {createStorefrontClient} from '@shopify/hydrogen';
import {ProductCard} from '~/components/ProductCard';

const PRODUCTS_QUERY = `#graphql
  query Products($first: Int!) {
    products(first: $first) {
      nodes {
        id
        title
        description
        descriptionHtml
        images(first: 10) {
          nodes {
            id
            url
            altText
            width
            height
          }
        }
        featuredImage {
          id
          url
          altText
          width
          height
        }
        variants(first: 20) {
          nodes {
            id
            title
            priceV2 {
              amount
              currencyCode
            }
            compareAtPriceV2 {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            image {
              id
              url
              altText
              width
              height
            }
            availableForSale
          }
        }
        options {
          id
          name
          values
        }
      }
    }
  }
`;

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  try {
    // Try to use context storefront first
    let storefront = context?.storefront;
    
    // If not available, create our own
    if (!storefront) {
      console.log('Creating storefront client directly...');
      if (!process.env.PUBLIC_STORE_DOMAIN || !process.env.PUBLIC_STOREFRONT_API_TOKEN) {
        throw new Error('Missing required environment variables: PUBLIC_STORE_DOMAIN and PUBLIC_STOREFRONT_API_TOKEN');
      }
      
      const client = createStorefrontClient({
        storeDomain: process.env.PUBLIC_STORE_DOMAIN,
        publicStorefrontToken: process.env.PUBLIC_STOREFRONT_API_TOKEN,
      });
      storefront = client.storefront;
    }

    const {products} = await storefront.query(PRODUCTS_QUERY, {
      variables: {
        first: 8,
      },
    });

    return json({products});
  } catch (error) {
    console.error('Error loading products:', error);
    return json({products: {nodes: []}});
  }
}

export default function Homepage() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Products Section */}
        {products.nodes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.nodes.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Products Yet</h3>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              Please add some products to your Shopify store to see them displayed here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
