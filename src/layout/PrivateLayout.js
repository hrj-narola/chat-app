import { useCallback, useEffect, useState } from 'react';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import { AppIconButton, ErrorBoundary } from '../components';
import { useOnMobile } from '../hooks/layout';
import { TOPBAR_DESKTOP_HEIGHT, TOPBAR_MOBILE_HEIGHT } from './config';
import TopBar from './TopBar/TopBar';
import { useAppStore } from '../store/app';
import { useEventSwitchDarkMode } from '../hooks';
import getMebyAxios from '../services/me';

const PrivateLayout = ({ children }) => {
  const [state, dispatch] = useAppStore();
  const onMobile = useOnMobile();
  const onSwitchDarkMode = useEventSwitchDarkMode();
  const [loading, setLoading] = useState(false);

  const getLoggedUserDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMebyAxios();
      dispatch({
        type: 'SET_CURRENT_USER',
        payload: response?.data || {},
      });
    } catch (error) {
      console.log('error');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    getLoggedUserDetail();
  }, [getLoggedUserDetail]);

  return (
    <Stack
      direction="column"
      sx={{
        height: '100vh', // Full screen height
        // paddingTop: onMobile ? TOPBAR_MOBILE_HEIGHT : TOPBAR_DESKTOP_HEIGHT,
      }}
    >
      {/* <Stack component="header">
        <TopBar
          startNode={<Typography variant="h5">Chat Now</Typography>}
          endNode={
            <Stack direction="row" spacing={2} alignItems={'center'}>
              <Stack direction={'row'} spacing={1} alignItems={'center'}>
                <Avatar
                  sx={{
                    width: 30,
                    height: 30,
                    fontSize: '3rem',
                  }}
                  alt={state?.currentUser?.userName || 'User Avatar'}
                  src={state?.currentUser?.profileImage}
                />
                <Typography variant="h6" color={'default'} sx={{ ml: 1 }}>
                  {state?.currentUser?.userName || 'Current User'}
                </Typography>
              </Stack>
              <Stack direction={'row'} spacing={1} alignItems={'center'}>
                <AppIconButton
                  icon={state.darkMode ? 'lightmode' : 'darkmode'}
                  title={state.darkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
                  onClick={onSwitchDarkMode}
                />
              </Stack>
            </Stack>
          }
        />
      </Stack> */}
      <Box
        component="main"
        sx={{
          paddingLeft: 1,
          paddingRight: 1,
          paddingTop: 1,
          flexGrow: 1,
          width: '100%',
          height: '100%',
          alignItems: 'flex-start',
        }}
      >
        <ErrorBoundary name="Content">{children}</ErrorBoundary>
      </Box>
    </Stack>
  );
};

export default PrivateLayout;
