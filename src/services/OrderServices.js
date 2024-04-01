import requests from './httpServices';

const OrderServices = {
  addOrder(body, headers) {
    return requests.post('/order/add', body, headers);
  },

  createPaymentIntent(body) {
    return requests.post('/order/create-payment-intent', body);
  },

  getOrderByUser({ page = 1, limit = 8 }) {
    return requests.get(`/order?limit=${limit}&page=${page}`);
  },
  getOrderById(id, body) {
    return requests.get(`/order/${id}`, body);
  },
  getOrderAdmin({ page = 1, limit = 8, status, tag }) {
    return requests.post(`/order/administracion?limit=${limit}&page=${page}`,{status: status, tag: tag});
  },
  updateOrderAdmin(id, body) {
    return requests.put(`/orders/${id}`,body);
  },
  sendEmailOrder(body){
    return requests.post('/order/sendemail',body);
  },
  getTagsById(id) {
    console.log(id)
    return requests.get(`/order/getTags/${id}`);
  },
};

export default OrderServices;
