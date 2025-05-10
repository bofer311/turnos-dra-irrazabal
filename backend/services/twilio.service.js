const twilio = require("twilio");
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

class TwilioService {
  static async sendWhatsAppMessage(to, body) {
    try {
      const message = await client.messages.create({
        body: body,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${to}`,
      });
      return message;
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      throw error;
    }
  }

  static getConfirmationTemplate(name, service, date, time, address) {
    return `¡Hola ${name}! 👋\n\nTu turno para *${service}* ha sido agendado:\n📅 *Fecha:* ${date}\n⏰ *Hora:* ${time} hs.\n\n📍 *Dirección:* ${address}.\n\nPor favor, respondé *CONFIRMAR* para asegurar tu turno o *CANCELAR* si necesitas reprogramar.\n\n¡Te esperamos! ✨`;
  }

  static get24hReminderTemplate(name, service, time) {
    return `Hola ${name},\n\nTe recordamos que *mañana* tienes tu turno en *Consultorio Irrazabal*:\n🕒 *Hora:* ${time} hs.\n💆 *Servicio:* ${service}.\n\n¿Necesitás cambiar o cancelar? Respondé *CANCELAR* y te ayudamos.\n\n¡Quedamos atentas a tu llegada! 🌸`;
  }

  static get4hReminderTemplate(name, service, time, address) {
    return `¡Hola ${name}!\n\nHoy es el día de tu sesión de *${service}*:\n⏰ *En 4 horas* (${time} hs.).\n\n📍 *Dirección:* ${address}.\n\nPor favor, llegá puntual. Si tenés algún imprevisto, avisanos respondiendo *CANCELAR*.\n\n¡Nos vemos pronto! 💖`;
  }

  static getPostAppointmentTemplate(name, service, reviewLink) {
    return `¡Gracias por confiar en Consultorio Irrazabal, ${name}!\n\nEsperamos que tu experiencia con *${service}* haya sido increíble. ¿Te gustaría dejar una valoración? (${reviewLink}).\n\n¡Hasta la próxima! ✨`;
  }
}

module.exports = TwilioService;
