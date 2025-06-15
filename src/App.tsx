import { AppBar, Box, Container, CssBaseline, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Momentum
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom align="center">
            Hello, World!
          </Typography>
          <Typography variant="body1" align="center">
            Welcome to Momentum - Your New Web App
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
