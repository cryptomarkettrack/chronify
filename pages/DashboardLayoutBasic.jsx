import DashboardIcon from '@mui/icons-material/Dashboard';
import LayersIcon from '@mui/icons-material/Layers';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import { Righteous } from 'next/font/google';
import PropTypes from 'prop-types';
import * as React from 'react';
import MarketCycleComparison from './MarketCycleComparison';
import Comparator from './Comparator';
import AboutSection from './AboutSection';

const font = Righteous({ subsets: ['latin'], weight: '400' });
const demoTheme = createTheme({
  typography: {
    fontFamily: font.style.fontFamily,
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
  palette: {
    primary: {
      main: '#3f51b5', // Set your desired primary main color here
    },
    secondary: {
      main: '#f50057', // Optional: set a secondary color
    },
    // Add other palette colors as needed
  },
});

function DashboardLayoutBasic({ window }) {
  const router = useDemoRouter('/comparator');

  // Function to map segments to their components
  const renderComponent = () => {
    switch (router.pathname) {
      case '/about':
        return <AboutSection />;
      case '/comparator':
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
          segment: 'about',
          title: 'Why Chronify?',
          icon: <LayersIcon />,
          onClick: () => router.navigate('about'), // Navigate on click
        },
        {
          segment: 'comparator',
          title: 'Comparator',
          icon: <DashboardIcon />,
          onClick: () => router.navigate('comparator'), // Navigate on click
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