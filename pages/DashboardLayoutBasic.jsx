import DashboardIcon from '@mui/icons-material/Dashboard';
import LayersIcon from '@mui/icons-material/Layers';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import { Teko } from 'next/font/google';
import PropTypes from 'prop-types';
import * as React from 'react';
import MarketCycleComparison from './MarketCycleComparison';
import Comparator from './Comparator';

const tekosFont = Teko({ subsets: ['latin'], weight: '400' });
const demoTheme = createTheme({
  typography: {
    fontFamily: tekosFont.style.fontFamily,
  },
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DashboardLayoutBasic({ window }) {
  const router = useDemoRouter('/dashboard');

  // Function to map segments to their components
  const renderComponent = () => {
    switch (router.pathname) {
      case '/dashboard':
        return <Comparator />;
      case '/marketCycleComparison':
        return <MarketCycleComparison />;
      default:
        return <div>404: Page Not Found</div>;
    }
  };

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  console.log('router.pathname', router.pathname)

  return (
    // preview-start
    <AppProvider
      navigation={[
        {
          segment: 'dashboard',
          title: 'Comparator',
          icon: <DashboardIcon />,
          onClick: () => router.navigate('dashboard'), // Navigate on click
        },
        {
          segment: 'marketCycleComparison',
          title: 'Market Cycle Comparison',
          icon: <LayersIcon />,
          onClick: () => router.navigate('marketCycleComparison'), // Navigate on click
        }
      ]
      }
      router={router}
      theme={demoTheme}
      window={demoWindow}
      branding={{
        logo: <img src="https://mui.com/static/logo.png" alt="Chronify" />,
        title: 'Chronify',
      }
      }
    >
      <DashboardLayout>
        {renderComponent()}
      </DashboardLayout>
    </AppProvider >
    // preview-end
  );
}

DashboardLayoutBasic.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default DashboardLayoutBasic;