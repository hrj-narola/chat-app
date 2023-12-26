import { useIsAuthenticated } from '../hooks/auth';
import PrivateLayout from './PrivateLayout';
import PublicLayout from './PublicLayout';

const CurrentLayout = (props) => {
  return useIsAuthenticated() ? <PrivateLayout {...props} /> : <PublicLayout {...props} />;
};

export default CurrentLayout;
