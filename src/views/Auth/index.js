import { Navigate, Route, Routes } from 'react-router-dom';
import AuthView from './Auth';
import SignupView from './Signup';
import LoginView from './Login';

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" />} />
      <Route path="/signup" element={<SignupView />} />
      <Route path="/login" element={<LoginView />} />
      <Route path="*" element={<AuthView />} />
    </Routes>
  );
};

export default AuthRoutes;
