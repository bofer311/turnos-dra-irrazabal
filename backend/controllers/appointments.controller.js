const TwilioService = require("../services/twilio.service");
const CalendarService = require("../services/calendar.service");
const FirebaseService = require("../services/firebase.service");

class AppointmentsController {
  static async createAppointment(req, res) {
    try {
      const { patientName, phone, service, date, time, address, notes } =
        req.body;

      // Formatear fechas para Google Calendar
      const startTime = new Date(`${date}T${time}:00-03:00`);
      const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 minutos después

      // Verificar disponibilidad
      const isAvailable = await CalendarService.checkAvailability(
        startTime.toISOString(),
        endTime.toISOString()
      );
      if (!isAvailable) {
        return res.status(400).json({ error: "El horario no está disponible" });
      }

      // Crear evento en Google Calendar
      const calendarEvent = await CalendarService.createAppointment({
        patientName,
        phone,
        service,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        notes,
      });

      // Guardar en Firebase
      const appointmentId = await FirebaseService.createAppointment({
        patientName,
        phone,
        service,
        date,
        time,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        calendarEventId: calendarEvent.id,
      });

      // Enviar mensaje de confirmación por WhatsApp
      const message = TwilioService.getConfirmationTemplate(
        patientName,
        service,
        date,
        time,
        address
      );

      await TwilioService.sendWhatsAppMessage(phone, message);

      res.status(201).json({
        id: appointmentId,
        calendarEventId: calendarEvent.id,
        message: "Turno creado exitosamente",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async handleIncomingMessage(req, res) {
    try {
      const { From, Body } = req.body;
      const phone = From.replace("whatsapp:", "");
      const message = Body.toLowerCase();

      // Buscar turnos pendientes para este número
      const appointments = await FirebaseService.getPendingConfirmations();
      const userAppointments = appointments.filter((a) => a.phone === phone);

      if (userAppointments.length === 0) {
        return res
          .status(404)
          .json({ error: "No se encontraron turnos pendientes" });
      }

      // Procesar respuesta
      if (message.includes("confirmar")) {
        await FirebaseService.updateAppointmentStatus(
          userAppointments[0].id,
          "confirmed"
        );
        await TwilioService.sendWhatsAppMessage(
          phone,
          "✅ Tu turno ha sido confirmado. ¡Gracias!"
        );
      } else if (message.includes("cancelar")) {
        await FirebaseService.updateAppointmentStatus(
          userAppointments[0].id,
          "cancelled"
        );
        await TwilioService.sendWhatsAppMessage(
          phone,
          "⚠️ Tu turno ha sido cancelado. ¿Querés reprogramar?"
        );
      }

      res.status(200).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async sendReminders(req, res) {
    try {
      // Obtener turnos confirmados en las próximas 24-28 horas (para recordatorio de 24h)
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const tomorrowPlus4 = new Date(tomorrow.getTime() + 4 * 60 * 60 * 1000);

      const appointments = await FirebaseService.getUpcomingAppointments();
      const appointmentsToRemind = appointments.filter((a) => {
        const appointmentTime = new Date(a.startTime);
        return appointmentTime >= tomorrow && appointmentTime <= tomorrowPlus4;
      });

      // Enviar recordatorios
      for (const appointment of appointmentsToRemind) {
        const message = TwilioService.get24hReminderTemplate(
          appointment.patientName,
          appointment.service,
          appointment.time
        );

        await TwilioService.sendWhatsAppMessage(appointment.phone, message);
      }

      res.status(200).json({
        remindersSent: appointmentsToRemind.length,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AppointmentsController;
