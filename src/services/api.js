import axiosInstance from './axios';
import { loadToken } from './auth/utils';
import * as auth from './auth';
import * as me from './me';

const api = {
  // Pre-configured HTTP request instances
  axios: axiosInstance,
  // fetch: fetch, // use custom fetch is needed

  // Properties
  token: () => loadToken(),
  get url() {
    return axiosInstance?.defaults?.baseURL;
  },

  // API "modules"
  auth,
  me,
};

export default api;
