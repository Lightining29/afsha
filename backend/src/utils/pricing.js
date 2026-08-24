export function getFinalPrice(product) {
  const price = product.price ?? 0;
  const now = new Date();
  // Flash sale price takes priority when active and not expired
  if (
    product.flashSale &&
    product.flashSalePrice > 0 &&
    (!product.flashSaleEndsAt || new Date(product.flashSaleEndsAt) > now)
  ) {
    return product.flashSalePrice;
  }
  const discount = product.discountPercent ?? 0;
  if (discount > 0) {
    return Math.round(price * (1 - discount / 100) * 100) / 100;
  }
  return price;
}

export function isBogoActive(product) {
  if (!product) return false;
  if (!product.isBogo) return false;
  if (product.bogoEndsAt && new Date(product.bogoEndsAt) <= new Date()) {
    return false;
  }
  return true;
}

export function getBogoPayableQuantity(product, quantity) {
  const qty = Number(quantity) || 1;
  if (isBogoActive(product)) {
    return Math.ceil(qty / 2);
  }
  return qty;
}

export function calculateItemTotal(product, quantity) {
  const finalPrice = getFinalPrice(product);
  const payableQty = getBogoPayableQuantity(product, quantity);
  return finalPrice * payableQty;
}

export function enrichProduct(product) {
  const obj = product.toObject ? product.toObject({ virtuals: true }) : { ...product };
  const now = new Date();
  // Determine if flash sale is still active
  const flashActive =
    obj.flashSale &&
    obj.flashSalePrice > 0 &&
    (!obj.flashSaleEndsAt || new Date(obj.flashSaleEndsAt) > now);
  obj.flashSaleActive = flashActive;

  // Determine if BOGO offer is still active
  const bogoActive = isBogoActive(obj);
  obj.isBogoActive = bogoActive;
  obj.bogoBadgeText = obj.bogoBadgeText || 'BUY 1 GET 1 FREE';

  obj.finalPrice = getFinalPrice(obj);
  obj.inStock = (obj.stockQuantity ?? 0) > 0;
  // Expose image as a URL path — never send raw binary to clients
  obj.image = obj._id ? `/api/images/product/${obj._id}` : null;
  // Expose all product images as position-based URLs. If the images[] array
  // isn't populated yet (legacy product), fall back to the single primary URL.
  if (obj._id) {
    const count = Array.isArray(obj.images) ? obj.images.length : 0;
    obj.images = count > 0
      ? Array.from({ length: count }, (_, i) => `/api/images/product/${obj._id}/${i}`)
      : [obj.image];
  } else {
    obj.images = [];
  }
  // Remove buffer fields from response
  delete obj.imageData;
  delete obj.imageContentType;
  return obj;
}
