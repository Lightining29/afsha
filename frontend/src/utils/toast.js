/**
 * Centralised SweetAlert2 toast utility — used everywhere in the app.
 * Import `sweetalert2/dist/sweetalert2.min.css` is handled in index.css via @import.
 */
import Swal from 'sweetalert2';

// Base toast mixin — all variants inherit from this
const Base = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  didOpen: (el) => {
    el.addEventListener('mouseenter', Swal.stopTimer);
    el.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

export const toastSuccess = (title, text) =>
  Base.fire({ icon: 'success', title, text });

export const toastError = (title, text) =>
  Base.fire({ icon: 'error', title, text, timer: 5000 });

export const toastInfo = (title, text) =>
  Base.fire({ icon: 'info', title, text });

export const toastWarning = (title, text) =>
  Base.fire({ icon: 'warning', title, text });

// ── Cart added toast ─────────────────────────────────────────────────────────
export function toastCart(productName, navigate) {
  return Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: true,
    confirmButtonText: 'View Cart →',
    confirmButtonColor: '#2563eb',
    showCloseButton: true,
    timer: 4500,
    timerProgressBar: true,
    didOpen: (el) => {
      el.addEventListener('mouseenter', Swal.stopTimer);
      el.addEventListener('mouseleave', Swal.resumeTimer);
    },
  }).fire({
    icon: 'success',
    title: 'Added to Cart!',
    text: productName,
  }).then((r) => {
    if (r.isConfirmed) {
      if (navigate) navigate('/cart');
      else window.location.href = '/cart';
    }
  });
}

// ── Wishlist toast ────────────────────────────────────────────────────────────
export function toastWishlist(added) {
  return Base.fire({
    icon: added ? 'success' : 'info',
    title: added ? 'Added to Wishlist' : 'Removed from Wishlist',
  });
}

// ── Hero Buy Now dialog ───────────────────────────────────────────────────────
export function toastBuyNow({ name, price, imgSrc }, navigate) {
  const imgHtml = imgSrc
    ? `<img src="${imgSrc}" alt="${name}"
         style="width:72px;height:72px;object-fit:contain;border-radius:10px;
                background:#f1f5f9;padding:6px;display:block;margin:0 auto 10px;" />`
    : '';

  return Swal.fire({
    html: `
      <div style="text-align:center;font-family:inherit">
        ${imgHtml}
        <p style="font-size:0.78rem;font-weight:700;letter-spacing:.08em;
                  text-transform:uppercase;color:#3b82f6;margin:0 0 4px">Added to Cart</p>
        <p style="font-weight:700;font-size:1rem;color:#0f172a;margin:0 0 4px">${name}</p>
        <p style="font-size:1.15rem;font-weight:700;color:#2563eb;margin:0 0 12px">${price}</p>
        <p style="font-size:0.85rem;color:#64748b;margin:0">What would you like to do?</p>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: '🚀 Checkout',
    cancelButtonText: 'Continue Shopping',
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#94a3b8',
    reverseButtons: true,
    focusConfirm: false,
    customClass: {
      popup: 'swal-buynow-popup',
      confirmButton: 'swal-buynow-confirm',
      cancelButton: 'swal-buynow-cancel',
    },
  }).then((r) => {
    if (r.isConfirmed && navigate) navigate('/checkout');
  });
}

// ── Confirm dialog (replaces native confirm()) ────────────────────────────────
export function confirmDialog(title, text, confirmText = 'Yes, delete', icon = 'warning') {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#94a3b8',
    reverseButtons: true,
    customClass: {
      popup: 'swal-confirm-popup',
    },
  });
}
