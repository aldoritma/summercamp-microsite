import { json, ActionFunction, redirect } from '@shopify/remix-oxygen';
import {CartForm, type CartQueryDataReturn } from '@shopify/hydrogen';

// Action to handle adding items to the cart and redirecting to checkout
export const action: ActionFunction = async ({ request, context }) => {
  const formData = await request.formData();
  const { inputs } = CartForm.getFormInput(formData);
  const { cart } = context;

  let result: CartQueryDataReturn;

  let status = 200;
  result = await cart.addLines(inputs.lines as any);

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }
  const {cart: cartResult, errors } = result;
  const checkoutUrl = cartResult.checkoutUrl;
  return redirect(checkoutUrl);
};
