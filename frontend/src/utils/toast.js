// Notifications are intentionally disabled. Pages retain their inline form and
// request error states without loading a toast/modal library.
export const toastSuccess = () => undefined;
export const toastError = () => undefined;
export const toastInfo = () => undefined;
export const toastWarning = () => undefined;
export const toastCart = () => undefined;
export const toastWishlist = () => undefined;

// "Buy now" still performs its expected action without displaying a modal.
export function toastBuyNow(_product, navigate) {
  navigate?.('/checkout');
}

// Destructive actions still require an explicit user confirmation.
export function confirmDialog(title, text) {
  return Promise.resolve({ isConfirmed: window.confirm(`${title}\n\n${text}`) });
}
