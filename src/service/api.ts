import axios from 'axios';

// Configuración base de la API (ajusta la URL según tu backend en Render)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_API_SECRET}`
  }
});

// Servicios para turnos
export const AppointmentService = {
  async create(appointmentData: any) {
    return api.post('/appointments', appointmentData);
  },

  async confirm(appointmentId: string) {
    return api.patch(`/appointments/${appointmentId}/confirm`);
  },

  async cancel(appointmentId: string) {
    return api.patch(`/appointments/${appointmentId}/cancel`);
  },

  async getUpcoming() {
    return api.get('/appointments/upcoming');
  }
};

// Servicio para enviar recordatorios (opcional)
export const ReminderService = {
  async send24hReminder(appointmentId: string) {
    return api.post('/reminders/24h', { appointmentId });
  },

  async send4hReminder(appointmentId: string) {
    return api.post('/reminders/4h', { appointmentId });
  }
};

// Servicio para WhatsApp (opcional)
export const WhatsAppService = {
  async sendTemplate(phone: string, templateName: string, variables: object) {
    return api.post('/whatsapp/send-template', {
      phone,
      templateName,
      variables
    });
  }
};