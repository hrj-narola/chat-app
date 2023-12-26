import { Stack } from '@mui/material/';
import { useAppStore } from '../store/app/AppStore';
import { ErrorBoundary, AppIconButton } from '../components';
import { useOnMobile } from '../hooks/layout';
import { useEventSwitchDarkMode } from '../hooks/event';
import TopBar from './TopBar';
import { TOPBAR_DESKTOP_HEIGHT, TOPBAR_MOBILE_HEIGHT } from './config';

const TITLE_PUBLIC = 'CHAT NOW';

const PublicLayout = ({ children }) => {
  const onMobile = useOnMobile();
  const onSwitchDarkMode = useEventSwitchDarkMode();
  const [state] = useAppStore();

  const title = TITLE_PUBLIC;
  document.title = title;

  return (
    <Stack
      sx={{
        minHeight: '100vh', // Full screen height
        paddingTop: onMobile ? TOPBAR_MOBILE_HEIGHT : TOPBAR_DESKTOP_HEIGHT,
      }}
    >
      <Stack component="header">
        <TopBar
          title={title}
          endNode={
            <AppIconButton
              icon={state.darkMode ? 'lightmode' : 'darkmode'}
              title={state.darkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
              onClick={onSwitchDarkMode}
            />
          }
        />
      </Stack>

      <Stack
        component="main"
        sx={{
          flexGrow: 1,
          padding: 1,
        }}
      >
        <ErrorBoundary name="Content">{children}</ErrorBoundary>
      </Stack>
    </Stack>
  );
};

export default PublicLayout;
