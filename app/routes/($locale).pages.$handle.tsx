import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import { QuickBuyButton } from '~/components/Button';
import {Money} from '@shopify/hydrogen';

export async function loader({ params, context }: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }
  const { storefront, cart } = context;
  const { page } = await storefront.query(PAGE_QUERY, {
    variables: {
      handle: params.handle,
    },
  });
  if (!page) {
    throw new Response('Not Found', { status: 404 });
  }
  return json({ page });
}
  
export default function Page() {
  const { page } = useLoaderData<typeof loader>();
  const { metafield } = page;
  const product = metafield?.reference;

  return (
    <div className="mx-auto max-w-2xl ">
      <header>
        <div className={`w-full h-[150px] lg:h-[230px] overflow-hidden relative mb-10`}>
          <div className="flex items-center justify-center absolute inset-0 bg-disable">
            <div className="px-20 text-3xl">
              <h1 className='text-display-huge'>{page.title}</h1>
            </div>
          </div>
        </div>
      </header>
      <main dangerouslySetInnerHTML={{ __html: page.body }} />
      <section className='mx-auto max-w-7xl px-6 lg:px-8'>
        {
          product && (
            <div className="">
              <h2>{product.title}</h2>
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:gap-x-8">
                {product.variants.edges.map(({ node }: any) => (
                  <div key={node.id} className="group relative bg-indigo-100 px-3 py-12 rounded">
                    <div className="mt-4  ">
                      <h3 className="text-sm text-gray-700 text-xl font-bold mb-5">
                        {node.title}
                      </h3>
                      <Money className="text-sm font-medium text-gray-900 mb-5" data={node?.price} />
                      <QuickBuyButton variantId={node.id} quantity={1} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      </section>

    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country)  {
    page(handle: $handle) {
      id
       title
       body
       seo {
        description
         title
      }
			metafield(namespace: "page", key: "product") {
        key
     		value
        reference {
        ... on Product {
          id
          title
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
      }
    }
  }
` as const;
