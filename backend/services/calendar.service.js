const { google } = require("googleapis");
const credentials = require("../google-calendar-credentials.json");

class CalendarService {
  static async getAuth() {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });
    return await auth.getClient();
  }

  static async createAppointment(event) {
    const auth = await this.getAuth();
    const calendar = google.calendar({ version: "v3", auth });

    const appointment = {
      summary: `Turno: ${event.service}`,
      description: `Paciente: ${event.patientName}\nTeléfono: ${
        event.phone
      }\nNotas: ${event.notes || "Sin notas"}`,
      start: {
        dateTime: event.startTime,
        timeZone: "America/Argentina/Buenos_Aires",
      },
      end: {
        dateTime: event.endTime,
        timeZone: "America/Argentina/Buenos_Aires",
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: 24 * 60 }, // 24 horas antes
          { method: "popup", minutes: 4 * 60 }, // 4 horas antes
        ],
      },
    };

    try {
      const response = await calendar.events.insert({
        calendarId: "primary",
        resource: appointment,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating calendar event:", error);
      throw error;
    }
  }

  static async checkAvailability(startTime, endTime) {
    const auth = await this.getAuth();
    const calendar = google.calendar({ version: "v3", auth });

    try {
      const response = await calendar.freebusy.query({
        resource: {
          timeMin: startTime,
          timeMax: endTime,
          items: [{ id: "primary" }],
        },
      });

      return response.data.calendars.primary.busy.length === 0;
    } catch (error) {
      console.error("Error checking availability:", error);
      throw error;
    }
  }
}

module.exports = CalendarService;
