import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import DashboardLayoutBasic from './DashboardLayoutBasic';
import { Analytics } from "@vercel/analytics/react"

export default function Home() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#F4E4BA',
      },
      secondary: {
        main: '#D9DCD6',
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
