import requestGenrico from "./HttpFormCliente";

const formgoogle = {
    submitForm(data) {
      return requestGenrico.post('1FAIpQLSehJ9M4eokjygjahZHZZuS9FZBCkbhuPzVRXM1B5TxiT7ccwA/formResponse',data);
    },
  };
  
  export default formgoogle;