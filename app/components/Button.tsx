import { CartForm } from '@shopify/hydrogen';
import type { CartLineInput } from '@shopify/hydrogen/storefront-api-types';
import type { FetcherWithComponents } from '@remix-run/react';

export const QuickBuyButton = ({
  variantId,
  quantity,
}: {
  variantId: string,
  quantity: number,
}) => {
  return (
    <CartForm
      route='/api/cart'
      action={CartForm.ACTIONS.LinesAdd}
      inputs={{
        lines: [
          {
            merchandiseId: variantId,
            quantity,
          } as unknown as CartLineInput
        ]
      }}
    >
    <button type="submit" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"> Book Now</button>
    </CartForm>
  )
}