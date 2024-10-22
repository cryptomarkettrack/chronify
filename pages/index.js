import { CssBaseline, ThemeProvider } from '@mui/material';
import { Bebas_Neue } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import DashboardLayoutBasic from './DashboardLayoutBasic';
import { Analytics } from "@vercel/analytics/react"

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
      <Analytics />
      <CssBaseline />
      <DashboardLayoutBasic />
    </ThemeProvider>
  );
}
