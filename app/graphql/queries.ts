import {gql} from 'graphql-tag';

export const PRODUCTS_QUERY = gql`
  query Products($first: Int!) {
    products(first: $first) {
      nodes {
        id
        title
        handle
        description
        vendor
        featuredImage {
          id
          url
          altText
          width
          height
        }
        images(first: 10) {
          nodes {
            id
            url
            altText
            width
            height
          }
        }
        options {
          id
          name
          values
        }
        variants(first: 10) {
          nodes {
            id
            title
            availableForSale
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
            priceV2 {
              amount
              currencyCode
            }
            compareAtPriceV2 {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;