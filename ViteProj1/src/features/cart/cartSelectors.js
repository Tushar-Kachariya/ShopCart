export const selectCartItems = (state) => state.cart.items;

export const selectSubTotal = (state) =>
  state.cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

export const selectTotalPrice = (state) => {
  const shipping = 50;

  const subTotal = state.cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (subTotal === 0) return 0;

  return subTotal + shipping;
};