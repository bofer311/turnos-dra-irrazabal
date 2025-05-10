import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import AppointmentList from './components/AppointmentList';
import CalendarView from './components/CalendarView';
import MessageTemplates from './components/MessageTemplates';

const theme = createTheme({
  palette: {
    primary: { main: '#4a148c' }, // Morado profesional
    secondary: { main: '#ff6f00' } // Naranja acento
  }
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <h1 style={{ color: '#4a148c' }}>Gestión de Turnos - Dra. Irrazábal</h1>
        <AppointmentList />
        <CalendarView />
        <MessageTemplates />
      </Container>
    </ThemeProvider>
  );
}