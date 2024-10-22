import { CssBaseline, ThemeProvider } from '@mui/material';
import { Bebas_Neue } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import DashboardLayoutBasic from './DashboardLayoutBasic';

const bebasFont = Bebas_Neue({ subsets: ['latin'], weight: '400' });

export default function Home() {
  const darkTheme = createTheme({
    typography: {
      fontFamily: bebasFont.style.fontFamily,
    },
    palette: {
      mode: 'dark',
      primary: {
        main: '#0052cc',
      },
      secondary: {
        main: '#edf2ff',
      },
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <DashboardLayoutBasic />
    </ThemeProvider>
  );
}
