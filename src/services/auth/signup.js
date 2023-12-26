import { api } from '..';
import { clearAuthData, fakeApiResponse, saveToken } from './utils';

const ENDPOINT = 'auth/signup';
const METHOD = 'signup()';

/**
 * Sign ups new user using email and password
 */
export async function signupByAxios({ userName, email, password }) {
  const payload = { userName, email, password };
  try {
    clearAuthData();
    const res = Number(process.env.REACT_APP_MULTIPASS) ? fakeApiResponse() : await api?.axios?.post(ENDPOINT, payload);
    const { data } = res;
    log.warn(`${METHOD} -`, data);
    return data;
  } catch (error) {
    log.error(`${METHOD} -`, error);
    throw error;
  }
}

export default signupByAxios;
