import axios from "axios";

var instance = axios.create({
    baseURL: 'https://docs.google.com/forms/d/e/',
    timeout: 60000,
    headers: {'X-Custom-Header': 'foobar',
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/x-www-form-urlencoded',
              'crossDomain': true
            },
    
  });
  
const requestGenrico = {
    post : (url,body) => instance.post(url,body),
};

export default requestGenrico;