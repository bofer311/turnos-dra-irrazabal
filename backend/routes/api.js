const express = require("express");
const router = express.Router();
const AppointmentsController = require("../controllers/appointments.controller");

// Crear nuevo turno
router.post("/appointments", AppointmentsController.createAppointment);

// Manejar mensajes entrantes de WhatsApp
router.post("/whatsapp-webhook", AppointmentsController.handleIncomingMessage);

// Enviar recordatorios (ejecutar periódicamente)
router.post("/send-reminders", AppointmentsController.sendReminders);

module.exports = router;
