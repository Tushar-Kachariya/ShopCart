export const selectCartItems = (state) => state.cart.items;

export const selectSubTotal = (state) =>
  state.cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

export const selectTotalPrice = (state) => {
  const shipping = 50;
  return (
    state.cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ) + shipping
  );
};
