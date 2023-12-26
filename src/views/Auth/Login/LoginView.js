import {useCallback, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
  Grid,
  TextField,
  Card,
  CardHeader,
  CardContent,
  InputAdornment,
} from "@mui/material";
import {useAppStore} from "../../../store/app";
import {AppButton, AppIconButton, AppLink} from "../../../components";
import {AppForm, AppAlert} from "../../../components/forms";
import {
  useAppForm,
  SHARED_CONTROL_PROPS,
  eventPreventDefault,
} from "../../../utils/form";
import {api} from "../../../services";

const VALIDATE_FORM_LOGIN_EMAIL = {
  email: {
    presence: true,
    email: true,
  },
  password: {
    presence: true,
    // length: {
    //   minimum: 8,
    //   maximum: 32,
    //   message: 'must be between 8 and 32 characters',
    // },
  },
};

const LoginView = () => {
  const navigate = useNavigate();
  const [, dispatch] = useAppStore();
  const [
    formState,
    ,
    /* setFormState */ onFieldChange,
    fieldGetError,
    fieldHasError,
  ] = useAppForm({
    validationSchema: VALIDATE_FORM_LOGIN_EMAIL,
    initialValues: {email: "hrj@narola.email", password: "123"},
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const values = formState.values;

  const handleShowPasswordClick = useCallback(() => {
    setShowPassword((oldValue) => !oldValue);
  }, []);

  const handleFormSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        setLoading(true);
        const response = await api?.auth?.login(values);
        dispatch({type: "LOG_IN"});
        navigate("/", {replace: true});
        dispatch({
          type: "SHOW_SUCCESS_TOAST",
          payload: response?.data?.message,
        });
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, values, navigate]
  );

  const handleCloseError = useCallback(() => setError(undefined), []);

  return (
    <AppForm onSubmit={handleFormSubmit}>
      <Card>
        <CardHeader title="Login with Email" />
        <CardContent>
          <TextField
            required
            label="Email"
            name="email"
            value={values.email}
            error={fieldHasError("email")}
            helperText={fieldGetError("email") || " "}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            required
            type={showPassword ? "text" : "password"}
            label="Password"
            name="password"
            value={values.password}
            error={fieldHasError("password")}
            helperText={fieldGetError("password") || " "}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <AppIconButton
                    aria-label="toggle password visibility"
                    icon={showPassword ? "visibilityon" : "visibilityoff"}
                    title={showPassword ? "Hide Password" : "Show Password"}
                    onClick={handleShowPasswordClick}
                    onMouseDown={eventPreventDefault}
                  />
                </InputAdornment>
              ),
            }}
          />
          {error ? (
            <AppAlert severity="error" onClose={handleCloseError}>
              {error}
            </AppAlert>
          ) : null}
          <Grid container justifyContent="center" alignItems="center">
            <AppButton
              type="submit"
              disabled={!formState.isValid || loading}
              loading={loading}
              startIcon={loading ? "save" : ""}
              color={"primary"}>
              Login with Email
            </AppButton>
            <AppButton variant="text" component={AppLink} to="/auth/signup">
              New User? Signup
            </AppButton>
          </Grid>
        </CardContent>
      </Card>
    </AppForm>
  );
};

export default LoginView;
