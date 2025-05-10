import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Chip,
  Button
} from '@mui/material';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  startTime: string;
  endTime: string;
}

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'appointments'),
      orderBy('startTime', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const appointmentsData: Appointment[] = [];
      querySnapshot.forEach((doc) => {
        appointmentsData.push({ id: doc.id, ...doc.data() } as Appointment);
      });
      setAppointments(appointmentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleSendReminder = async (phone: string, appointment: Appointment) => {
    try {
      // Aquí implementar la lógica para enviar recordatorio
      console.log(`Enviar recordatorio a ${phone}`, appointment);
      alert('Recordatorio enviado');
    } catch (error) {
      console.error('Error sending reminder:', error);
    }
  };

  if (loading) return <div>Cargando turnos...</div>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Paciente</TableCell>
            <TableCell>Servicio</TableCell>
            <TableCell>Fecha y Hora</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{appointment.patientName}</TableCell>
              <TableCell>{appointment.service}</TableCell>
              <TableCell>
                {format(new Date(appointment.startTime), 'dd/MM/yyyy HH:mm')}
              </TableCell>
              <TableCell>
                <Chip 
                  label={appointment.status} 
                  color={getStatusColor(appointment.status)} 
                />
              </TableCell>
              <TableCell>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => handleSendReminder(appointment.phone, appointment)}
                >
                  Recordatorio
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}