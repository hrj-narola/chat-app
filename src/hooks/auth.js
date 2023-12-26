import {useCallback} from "react";
import {useAppStore} from "../store/app";
import {clearAuthData} from "../services/auth/utils";
import {useNavigate} from "react-router-dom";
import {distroySocketConnection} from "../services/socket";

/**
 * Hook to detect is current user authenticated or not
 */
export function useIsAuthenticated() {
  const [state] = useAppStore();
  let result = state.isAuthenticated;

  return Boolean(result);
}

/**
 * Returns event handler to Logout current user
 */
export function useEventLogout() {
  const [, dispatch] = useAppStore();
  const navigate = useNavigate();

  return useCallback(() => {
    clearAuthData();
    dispatch({type: "LOG_OUT"});
    // distroySocketConnection();
    navigate("/");
  }, [dispatch, navigate]);
}
