import {useEffect} from "react";
import {useAppStore} from "../store/app";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import {clearAuthData, isUserStillLoggedIn} from "../services/auth/utils";
import {useIsAuthenticated} from "../hooks/auth";
import {useNavigate} from "react-router-dom";
import {AppSnackBarAlert} from "../components/AppSnackBar";
import WorkSpaceProvider from "../store/workspace";
import {establishSocketConnection} from "../services/socket";
import {connectToRooms} from "../services/socket/messaging";

const AppRoutes = () => {
  const [state, dispatch] = useAppStore();
  const isAuthenticated = useIsAuthenticated();

  const navigate = useNavigate();

  const handleSuccessClose = () => {
    dispatch({
      type: "SHOW_SUCCESS_TOAST",
      payload: undefined,
    });
  };
  const handleErrorClose = () => {
    dispatch({
      type: "SHOW_ERROR_TOAST",
      payload: undefined,
    });
  };

  const isLogged = isUserStillLoggedIn();

  useEffect(() => {
    if (isAuthenticated && !isLogged) {
      clearAuthData();
      navigate("/");
    }
    if (isLogged && !isAuthenticated) {
      dispatch({type: "LOG_IN"});
    }
    // eslint-disable-next-line
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      establishSocketConnection();
      connectToRooms();
    }
  }, [isAuthenticated]);

  log.info("AppRoutes() - isAuthenticated:", state.isAuthenticated);
  return (
    <>
      {isAuthenticated ? (
        <WorkSpaceProvider user={state?.currentUser}>
          <PrivateRoutes />
        </WorkSpaceProvider>
      ) : (
        <PublicRoutes />
      )}

      {/* Global Success message */}
      <AppSnackBarAlert
        message={state?.success ?? ""}
        open={!!state?.success}
        severity={"success"}
        onClose={handleSuccessClose}
        closeByClickAway={true}
        anchorOrigin={{vertical: "top", horizontal: "right"}}
      />

      {/* Global Error Message */}
      <AppSnackBarAlert
        message={state?.error ?? ""}
        open={!!state?.error}
        severity={"error"}
        onClose={handleErrorClose}
        closeByClickAway={true}
        anchorOrigin={{vertical: "top", horizontal: "right"}}
      />
    </>
  );
};

export default AppRoutes;
