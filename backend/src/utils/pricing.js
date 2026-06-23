export function getFinalPrice(product) {
  const price = product.price ?? 0;
  const discount = product.discountPercent ?? 0;
  if (discount > 0) {
    return Math.round(price * (1 - discount / 100) * 100) / 100;
  }
  return price;
}

export function enrichProduct(product) {
  const obj = product.toObject ? product.toObject({ virtuals: true }) : { ...product };
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
