import { api } from '..';
import { localStorageSet, localStorageGet, localStorageDelete } from '../../utils/localStorage';

const ACCESS_TOKEN_KEY = 'token';

/**
 * Removes token from "api" and all auth data from the local storage
 */
export function clearAuthData() {
  api.token = undefined;
  localStorageDelete(ACCESS_TOKEN_KEY);
}

/**
 * Apples new "access token" into "api" and saves it in the local storage
 */
export function saveToken(newToken = api.token) {
  if (api.token !== newToken) {
    api.token = newToken;
  }
  localStorageSet(ACCESS_TOKEN_KEY, api.token);
}

/**
 * Loads "access token" from the local storage and sets it into "api"
 */
export function loadToken() {
  const token = Number(process.env.REACT_APP_MULTIPASS) ? 'Leeloo Dallas Multipass' : localStorageGet(ACCESS_TOKEN_KEY);
  return token;
}

/**
 * Verifies is the current user still logged in, updates the "token refresh timer" if needed
 */
export function isUserStillLoggedIn() {
  return localStorageGet(ACCESS_TOKEN_KEY);
}

/**
 * Generates API response alike object to emulate login when env.REACT_APP_MULTIPASS is set
 */
export function fakeApiResponse() {
  if (!process.env.REACT_APP_MULTIPASS) return { data: {} }; // The "MultiPass" mode not found

  return {
    data: { access_token: 'Leeloo Dallas Multipass' },
  };
}
