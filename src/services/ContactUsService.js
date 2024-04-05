import requests from './httpServices';

const formgoogle = {
    submitForm(data) {
      return requests.post('/contacus/sendmessage',data);
    },
  };
  
  export default formgoogle;