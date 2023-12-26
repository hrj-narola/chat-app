import { api } from '..';
import { clearAuthData, fakeApiResponse, saveToken } from './utils';

const ENDPOINT = 'auth/login';
const METHOD = 'login()';

export async function loginByAxios({ email, password }) {
  const payload = {
    email,
    password,
  };
  try {
    clearAuthData();
    const res = Number(process.env.REACT_APP_MULTIPASS) ? fakeApiResponse() : await api?.axios?.post(ENDPOINT, payload);
    const { data } = res;
    saveToken(data?.data?.token);
    log.warn(`${METHOD} -`, data);
    return data;
  } catch (error) {
    log.error(`${METHOD} -`, error);
    throw error;
  }
}

export default loginByAxios;
