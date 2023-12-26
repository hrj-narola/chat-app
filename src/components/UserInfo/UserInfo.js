import PropTypes from 'prop-types';
import { Avatar, Stack, Typography } from '@mui/material';
import AppLink from '../AppLink';


const UserInfo = ({ showAvatar = false, user, ...restOfProps }) => {
  const fullName = user?.userName;
  const srcAvatar = user?.profileImage ? user?.profileImage : undefined;
  const userPhoneOrEmail = user?.phone || user?.email;

  return (
    <Stack alignItems="center" minHeight="fit-content" marginBottom={2} {...restOfProps}>
      {showAvatar ? (
        <AppLink to="/user" underline="none">
          <Avatar
            sx={{
              width: 64,
              height: 64,
              fontSize: '3rem',
            }}
            alt={fullName || 'User Avatar'}
            src={srcAvatar}
          />
        </AppLink>
      ) : null}
      <Typography sx={{ mt: 1 }} variant="h6">
        {fullName || 'Current User'}
      </Typography>
      <Typography variant="body2">{userPhoneOrEmail || 'Loading...'}</Typography>
    </Stack>
  );
};

UserInfo.propTypes = {
  showAvatar: PropTypes.bool,
  user: PropTypes.shape({
    name: PropTypes.string,
    nameFirst: PropTypes.string,
    nameLast: PropTypes.string,
    avatar: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
  }),
};

export default UserInfo;
