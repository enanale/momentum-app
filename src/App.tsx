import { AppBar, Avatar, Box, Button, CircularProgress, CssBaseline, IconButton, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';
import styles from './styles/App.module.css';
import { Google as GoogleIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from './hooks/useAuth';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #2C5364 0%, #203A43 50%, #0F2027 100%)',
          boxShadow: '0 3px 5px 2px rgba(15, 32, 39, 0.3)'
        }
      }
    }
  }
});

function App() {
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className={styles.pageContainer}>
        <AppBar position="fixed">
          <Toolbar>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 500,
                letterSpacing: '0.5px'
              }}
            >
              Momentum
            </Typography>
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
          <Typography variant="body1" align="center" className={styles.subText}>
            Welcome to Momentum{user ? ' - Your Personal Dashboard' : ' - Your New Web App'}
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
