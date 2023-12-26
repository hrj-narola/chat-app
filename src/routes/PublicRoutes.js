import { Navigate, Route, Routes } from 'react-router-dom';
import AuthRoutes from '../views/Auth';
import { NotFoundView } from '../views';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace={true} />} />
      <Route path="auth/*" element={<AuthRoutes />} />
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};

export default PublicRoutes;
