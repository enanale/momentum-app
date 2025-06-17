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
      main: 'rgba(89, 58, 85, 0.95)', // sunset purple
      light: 'rgba(89, 58, 85, 0.8)',
      dark: 'rgba(67, 35, 55, 0.95)',
      contrastText: '#fff',
    },
    background: {
      default: '#fff',
      paper: 'rgba(255, 255, 255, 0.92)',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.75)',
      secondary: 'rgba(89, 58, 85, 0.8)',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(89, 58, 85, 0.85) 0%, rgba(82, 45, 70, 0.9) 50%, rgba(67, 35, 55, 0.95) 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 3px 15px rgba(0, 0, 0, 0.15)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.3)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.3)',
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
