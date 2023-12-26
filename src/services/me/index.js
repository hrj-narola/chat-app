import { api } from '..';
import { fakeApiResponse } from '../auth/utils';

const ENDPOINT = '/users';
const METHOD = 'me()';

async function getMebyAxios() {
  try {
    const res = Number(process.env.REACT_APP_MULTIPASS) ? fakeApiResponse() : await api?.axios?.get(ENDPOINT);
    const { data } = res;
    log.warn(`${METHOD} -`, data);
    return data;
  } catch (error) {
    log.error(`${METHOD} -`, error);
    throw error;
  }
}

export { getMebyAxios as default, getMebyAxios };
