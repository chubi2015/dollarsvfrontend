import requests from './httpServices';

const ProductServices = {
  getShowingProducts() {
    return requests.get('/products/show');
  },

  getDiscountedProducts() {
    return requests.get('/products/discount');
  },

  getProductBySlug(slug) {
    return requests.get(`/products/${slug}`);
  },

  updateProductBySlug(slug, producto) {
    return requests.put(`/products/${slug}`, producto);
  },
};

export default ProductServices;
