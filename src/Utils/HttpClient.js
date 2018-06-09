import axios from 'axios';
import { getToken } from '../Utils/Token';

// const HOST = process.env.NODE_ENV === 'development'
//  ? 'http://localhost:3001'
//  : 'http://localhost:3000';
const validateStatus = function validateStatus(status) {
  return status >= 200 && status <= 299; // default
};
export default {
  guest: function guest() {
    return axios.create({
      baseURL: `/`,
      validateStatus,
    });
  },
  auth: function api() {
    return axios.create({
      baseURL: `/api/auth`,
      headers: {
        Authorization: `JWT ${getToken()}`,
      },
      validateStatus,
    });
  },
  api: function api() {
    return axios.create({
      baseURL: `/api/`,
      validateStatus,
    });
  },
};
