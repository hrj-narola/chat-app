import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent, InputAdornment, LinearProgress } from '@mui/material';
import { useAppStore } from '../../../store/app';
import { AppButton, AppIconButton } from '../../../components';
import { AppForm, AppAlert } from '../../../components/forms';
import { useAppForm, SHARED_CONTROL_PROPS, eventPreventDefault } from '../../../utils/form';
import { api } from '../../../services';

const VALIDATE_FORM_SIGNUP = {
  email: {
    email: true,
    presence: true,
  },

  userName: {
    type: 'string',
    presence: { allowEmpty: false },
  },
  password: {
    presence: true,
    length: {
      minimum: 8,
      maximum: 32,
      message: 'must be between 8 and 32 characters',
    },
  },
};

const VALIDATE_EXTENSION = {
  confirmPassword: {
    equality: 'password',
  },
};

const SignupView = () => {
  const navigate = useNavigate();
  const [, dispatch] = useAppStore();
  const [validationSchema, setValidationSchema] = useState({
    ...VALIDATE_FORM_SIGNUP,
    ...VALIDATE_EXTENSION,
  });
  const [formState, , /* setFormState */ onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: validationSchema, // the state value, so could be changed in time
    initialValues: {
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const values = formState.values;

  useEffect(() => {
    // Update Validation Schema when Show/Hide password changed
    let newSchema;
    if (showPassword) {
      newSchema = VALIDATE_FORM_SIGNUP; // Validation without .confirmPassword
    } else {
      newSchema = { ...VALIDATE_FORM_SIGNUP, ...VALIDATE_EXTENSION }; // Full validation
    }
    setValidationSchema(newSchema);
  }, [showPassword]);

  const handleShowPasswordClick = useCallback(() => {
    setShowPassword((oldValue) => !oldValue);
  }, []);

  const handleFormSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        setLoading(true);
        const response = await api?.auth?.signup(values);
        navigate('/', { replace: true });
        dispatch({
          type: 'SHOW_SUCCESS_TOAST',
          payload: response?.data?.message,
        });
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [values, navigate, dispatch]
  );

  const handleCloseError = useCallback(() => setError(undefined), []);

  return (
    <AppForm onSubmit={handleFormSubmit}>
      <Card>
        <CardHeader title="Sign Up" />
        <CardContent>
          <TextField
            required
            label="Username"
            name="userName"
            value={values.userName}
            error={fieldHasError('userName')}
            helperText={fieldGetError('userName') || ' '}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            required
            label="Email"
            name="email"
            value={values.email}
            error={fieldHasError('email')}
            helperText={fieldGetError('email') || ' '}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            required
            type={showPassword ? 'text' : 'password'}
            label="Password"
            name="password"
            value={values.password}
            error={fieldHasError('password')}
            helperText={fieldGetError('password') || ' '}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <AppIconButton
                    aria-label="toggle password visibility"
                    icon={showPassword ? 'visibilityon' : 'visibilityoff'}
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                    onClick={handleShowPasswordClick}
                    onMouseDown={eventPreventDefault}
                  />
                </InputAdornment>
              ),
            }}
          />
          {!showPassword && (
            <TextField
              required
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              value={values.confirmPassword}
              error={fieldHasError('confirmPassword')}
              helperText={fieldGetError('confirmPassword') || ' '}
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
          )}

          {error ? (
            <AppAlert severity="error" onClose={handleCloseError}>
              {error}
            </AppAlert>
          ) : null}

          <Grid container justifyContent="center" alignItems="center">
            <AppButton type="submit" disabled={!formState.isValid}>
              Confirm and Sign Up
            </AppButton>
          </Grid>
        </CardContent>
      </Card>
    </AppForm>
  );
};

export default SignupView;
