import { AppBar, Avatar, Box, Button, CircularProgress, CssBaseline, IconButton, ThemeProvider, Toolbar, Typography, Alert, Snackbar } from '@mui/material';
import { Logo } from './components/Logo';
import { StuckButton } from './components/StuckButton';
import { VoidForm } from './components/VoidForm';
import type { VoidFormData } from './types/void';
import styles from './styles/App.module.css';
import { Google as GoogleIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useState, useCallback, useMemo } from 'react';
import { createVoidEntry } from './services/voidService';
import { DailyOperatingDoc } from './components/DailyOperatingDoc';
import { useAuth } from './hooks/useAuth';
import { ErrorBoundary } from './components/ErrorBoundary';
import { theme } from './theme';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

interface ErrorState {
  message: string;
  severity: 'error' | 'warning' | 'info' | 'success';
}

function App() {
  const { user, loading, error: authError, signInWithGoogle, signOutUser } = useAuth();
  const [isVoidFormOpen, setIsVoidFormOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [error, setError] = useState<ErrorState | null>(null);

  const handleError = useCallback((message: string, severity: ErrorState['severity'] = 'error') => {
    setError({ message, severity });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleVoidFormSubmit = useCallback(async (formData: VoidFormData) => {
    if (!user?.uid) {
      handleError('You must be signed in to create a void entry');
      return;
    }

    try {
      await createVoidEntry(user.uid, formData);
      setIsVoidFormOpen(false);
      setRefreshTrigger(prev => prev + 1);
      handleError('Successfully created void entry', 'success');
    } catch (error) {
      console.error('Error creating void entry:', error);
      handleError('Failed to create void entry. Please try again.');
    }
  }, [user, handleError]);

  const handleSignInClick = useCallback(async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign in with Google. Please try again.';
      handleError(message);
    }
  }, [signInWithGoogle, handleError]);

  const handleSignOutClick = useCallback(async () => {
    try {
      await signOutUser();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign out. Please try again.';
      handleError(message);
    }
  }, [signOutUser, handleError]);

  // Show auth error if present
  useMemo(() => {
    if (authError) {
      handleError(authError.message);
    }
  }, [authError, handleError]);

  const userFirstName = useMemo(() => {
    return user?.displayName?.split(' ')[0] || 'there';
  }, [user?.displayName]);

  const renderAuthButtons = useMemo(() => {
    if (loading) {
      return <CircularProgress size={24} sx={{ color: 'white' }} />;
    }

    if (user) {
      return (
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
            onClick={handleSignOutClick}
            title="Sign out"
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      );
    }

    return (
      <Button
        variant="outlined"
        color="inherit"
        startIcon={<GoogleIcon />}
        onClick={handleSignInClick}
      >
        Sign in
      </Button>
    );
  }, [loading, user, handleSignOutClick, handleSignInClick]);

  return (
    <ErrorBoundary>
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
              {renderAuthButtons}
            </Toolbar>
          </AppBar>
          <Toolbar /> {/* This toolbar is for spacing below the fixed AppBar */}
          <Box component="main" className={styles.mainContainer}>
            <Typography variant="h1" component="h1" gutterBottom align="center" className={styles.heading}>
              Hello, {userFirstName}!
            </Typography>
            {user ? (
              <DailyOperatingDoc userId={user.uid} refreshTrigger={refreshTrigger} />
            ) : (
              <Typography 
                variant="h6" 
                component="h1" 
                gutterBottom
                className={styles.subText}
              >
                Feeling Stuck?  Let's break it down.
              </Typography>
            )}
          </Box>
          {user && (
            <>
              <StuckButton onClick={() => setIsVoidFormOpen(true)} />
              <VoidForm
                open={isVoidFormOpen}
                onClose={() => setIsVoidFormOpen(false)}
                onSubmit={handleVoidFormSubmit}
              />
            </>
          )}
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={clearError}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={clearError}
              severity={error?.severity || 'error'}
              variant="filled"
              sx={{ width: '100%' }}
            >
              {error?.message || ''}
            </Alert>
          </Snackbar>
        </Box>
      </ThemeProvider>
    </ErrorBoundary>
  );
}


export default App;
