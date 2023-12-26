import { localStorageSet } from '../../utils/localStorage';

const AppReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return {
        ...state,
        currentUser: action?.currentUser || action?.payload,
      };
    case 'SIGN_UP':
    case 'LOG_IN':
      return {
        ...state,
        isAuthenticated: true,
      };
    case 'LOG_OUT':
      return {
        ...state,
        isAuthenticated: false,
        currentUser: undefined,
      };
    case 'DARK_MODE': {
      const darkMode = action?.darkMode ?? action?.payload;
      localStorageSet('darkMode', darkMode);
      return {
        ...state,
        darkMode,
      };
    }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'SHOW_SUCCESS_TOAST':
      return {
        ...state,
        success: action.payload,
      };
    case 'SHOW_ERROR_TOAST':
      return {
        ...state,
        error: action.payload,
      };
    case 'FETCH_USERS_LIST':
      return {
        ...state,
        users: action.payload,
      };
    default:
      return state;
  }
};

export default AppReducer;
