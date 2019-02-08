import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://119.29.162.64:3031',
  timeout: 30000,
});

export default instance;
