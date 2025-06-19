import { AppBar, Avatar, Box, Button, CircularProgress, CssBaseline, IconButton, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';
import { Logo } from './components/Logo';
import { StuckButton } from './components/StuckButton';
import { VoidForm } from './components/VoidForm';
import type { VoidEntry } from './types/void';
import styles from './styles/App.module.css';
import { Google as GoogleIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useState } from 'react';
import { createVoidEntry } from './services/voidService';
import { DailyOperatingDoc } from './components/DailyOperatingDoc';
import { useAuth } from './hooks/useAuth';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme({
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
  },
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

function App() {
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();
  const [isVoidFormOpen, setIsVoidFormOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className={styles.pageContainer}>
        <AppBar position="fixed">
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 2 }}>
              <Logo height={36} />
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 500,
                  letterSpacing: '0.5px'
                }}
              >
                Momentum
              </Typography>
            </Box>
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  {user.displayName}
                </Typography>
                {user.photoURL && (
                  <Avatar
                    src={user.photoURL}
                    alt={user.displayName || ''}
                    sx={{ width: 32, height: 32 }}
                  />
                )}
                <IconButton
                  color="inherit"
                  onClick={signOutUser}
                  title="Sign out"
                >
                  <LogoutIcon />
                </IconButton>
              </Box>
            ) : (
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<GoogleIcon />}
                onClick={signInWithGoogle}
              >
                Sign in
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <Toolbar /> {/* This toolbar is for spacing below the fixed AppBar */}
        <Box component="main" className={styles.mainContainer}>
          <Typography variant="h2" component="h1" gutterBottom align="center" className={styles.heading}>
            Hello, {user ? user.displayName?.split(' ')[0] || 'there' : 'World'}!
          </Typography>
          {user ? (
            <DailyOperatingDoc userId={user.uid} refreshTrigger={refreshTrigger} />
          ) : (
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              className={styles.subText}
            >
              Welcome to Momentum - Your New Web App
            </Typography>
          )}
        </Box>
        {user && (
          <>
            <StuckButton onClick={() => setIsVoidFormOpen(true)} />
            <VoidForm
              open={isVoidFormOpen}
              onClose={() => setIsVoidFormOpen(false)}
              onSubmit={async (voidEntry: Partial<VoidEntry>) => {
                if (!user?.uid) return;
                try {
                  await createVoidEntry(user.uid, voidEntry);
                  setIsVoidFormOpen(false);
                  setRefreshTrigger(prev => prev + 1); // Trigger refresh
                } catch (error) {
                  console.error('Error creating void entry:', error);
                  // TODO: Add error handling/notification
                }
              }}
            />
          </>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
