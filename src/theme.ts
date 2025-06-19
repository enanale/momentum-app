import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: 'rgba(89, 58, 85, 0.92)',
      light: 'rgba(176, 136, 174, 0.92)',
      dark: 'rgba(10, 9, 32, 0.92)',
      contrastText: '#fff',
    },
    background: {
      default: 'rgba(250, 250, 255, 1)',
      paper: 'rgba(255, 255, 255, 0.5)',
    },
    text: {
      primary: 'rgba(10, 9, 32, 0.92)',
      secondary: 'rgba(89, 58, 85, 0.92)',
    },
  } as const,
  typography: {
    fontFamily: '"Raleway", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '-0.011em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 9, 32, 0.9)',
          backdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fff',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          padding: '8px 16px',
          fontWeight: 500,
          backdropFilter: 'blur(10px)',
          background: 'rgba(89, 58, 85, 0.1)',
          border: '1px solid rgba(89, 58, 85, 0.2)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            background: 'rgba(89, 58, 85, 0.15)',
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 8px rgba(89, 58, 85, 0.15)',
          },
        },
        contained: {
          background: 'rgba(89, 58, 85, 0.92)',
          border: 'none',
          color: '#fff',
          '&:hover': {
            background: 'rgba(89, 58, 85, 0.85)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(20px) saturate(180%)',
          background: 'rgba(255, 255, 255, 0.5)',
          borderRadius: 24,
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.03)',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backdropFilter: 'blur(20px) saturate(180%)',
          background: 'rgba(255, 255, 255, 0.7)',
          borderRadius: 24,
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12,
            border: '1px solid rgba(89, 58, 85, 0.2)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: 'rgba(89, 58, 85, 0.3)',
            },
            '&.Mui-focused': {
              borderColor: 'rgba(89, 58, 85, 0.5)',
              boxShadow: '0 0 0 4px rgba(89, 58, 85, 0.1)',
            },
          },
        },
      },
    },
  },
});
