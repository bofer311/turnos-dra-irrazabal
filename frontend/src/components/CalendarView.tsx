import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAppointments } from '../hooks/useAppointments';

const locales = {
  'es': es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarView() {
  const { appointments } = useAppointments();

  const events = appointments.map(appt => ({
    title: `${appt.patientName} - ${appt.service}`,
    start: new Date(`${appt.date}T${appt.time}:00`),
    end: new Date(new Date(`${appt.date}T${appt.time}:00`).getTime() + 30 * 60000),
    status: appt.status,
  }));

  const eventStyleGetter = (event: any) => {
    let backgroundColor = '#4a148c';
    if (event.status === 'confirmed') backgroundColor = '#2e7d32';
    if (event.status === 'cancelled') backgroundColor = '#c62828';

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
      },
    };
  };

  return (
    <div style={{ height: 600, marginTop: '2rem' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        culture="es"
        messages={{
          today: 'Hoy',
          previous: 'Anterior',
          next: 'Siguiente',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
        }}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
}