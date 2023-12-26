import React from 'react';
import { LinearProgress } from '@mui/material';

const DefaultFallback = <LinearProgress />;

export const withSuspense = (WrappedComponent, FallbackComponent = DefaultFallback) => {
  return class extends React.Component {
    render() {
      return (
        <React.Suspense fallback={FallbackComponent}>
          <WrappedComponent {...this.props} />
        </React.Suspense>
      );
    }
  };
};

export default withSuspense;
