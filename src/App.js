import { BrowserRouter } from 'react-router-dom';
import { AppStoreProvider } from './store/app';
import { AppThemeProvider } from './theme';
import { AppSnackBarProvider } from './components/AppSnackBar';
import Routes from './routes';
import Layout from './layout';
import { ErrorBoundary } from './components';

const App = () => {
  return (
    <ErrorBoundary name="App">
      <AppStoreProvider>
        <AppThemeProvider>
          <AppSnackBarProvider>
            <BrowserRouter>
              <Layout>
                <Routes />
              </Layout>
            </BrowserRouter>
          </AppSnackBarProvider>
        </AppThemeProvider>
      </AppStoreProvider>
    </ErrorBoundary>
  );
};

export default App;
