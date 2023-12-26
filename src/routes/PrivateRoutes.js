import { Navigate, Route, Routes } from 'react-router-dom';
import { WelcomeView, AboutView, NotFoundView, ChatRoomView } from '../views';

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<ChatRoomView />} />
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};

export default PrivateRoutes;
