import axios from 'axios'
import {store} from './src/redux/store'

// export const baseAxios = axios.create({
//   baseURL: 'http://localhost:8001'
// })

axios.defaults.baseURL = 'http://localhost:8001'

// let a = 0 
// 路由拦截器
axios.interceptors.request.use(function (config) {
  // Do something before request is sent


  store.dispatch({
    type: 'change loading',
    // payload:
  })


  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data

  store.dispatch({
    type: 'change loading'
  })


  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error

  return Promise.reject(error);
});