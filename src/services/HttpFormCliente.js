import axios from "axios";

var instance = axios.create({
    baseURL: 'https://docs.google.com/forms/d/e/',
    timeout: 60000,
    headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Control-Allow-Origin': 'https://dollarsvfrontend-ten.vercel.app',
              'Access-Control-Allow-Methods': 'POST',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              crossDomain: true,
				 	    dataType: "xml",
            },
    
  });
  
const requestGenrico = {
    post : (url,body) => instance.post(url,body),
};

export default requestGenrico;