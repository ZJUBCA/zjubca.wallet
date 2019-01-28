import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://zjubca.org',
  timeout: 30000,
});

export default instance;
