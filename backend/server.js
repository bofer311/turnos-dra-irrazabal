require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const apiRoutes = require("./routes/api");
const axios = require("axios");
const { CronJob } = require("cron");

const app = express();

// ===== Configuración Middleware ===== //
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ===== Rutas ===== //
app.use("/api", apiRoutes);

// ===== Manejo de Errores ===== //
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

// ===== Función para Recordatorios Automáticos ===== //
const sendDailyReminders = async () => {
  try {
    // Obtener la URL base dinámicamente (funciona en Render y local)
    const baseUrl =
      process.env.RENDER_EXTERNAL_URL ||
      `http://localhost:${process.env.PORT || 3000}`;
    console.log(`🌐 Usando URL base: ${baseUrl}`);

    const response = await axios.post(
      `${baseUrl}/api/send-reminders`,
      {},
      {
        headers: {
          Authorization: `Bearer ${process.env.API_SECRET_KEY}`, // Opcional: añade seguridad
        },
      }
    );
    console.log("✅ Recordatorios enviados:", response.data.remindersSent);
  } catch (error) {
    console.error(
      "❌ Error enviando recordatorios:",
      error.response?.data || error.message
    );
  }
};

// ===== Configurar Cron Job ===== //
if (process.env.NODE_ENV === "production") {
  new CronJob(
    "0 11 * * *", // 8 AM ARG = 11 AM UTC (Render usa UTC)
    sendDailyReminders,
    null,
    true,
    "UTC" // Render ejecuta en UTC
  );
  console.log("⏰ Cron Job configurado para 8 AM (hora Argentina)");
}

// ===== Iniciar Servidor ===== //
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
  console.log(`🔧 Entorno: ${process.env.NODE_ENV || "development"}`);
  if (process.env.RENDER_EXTERNAL_URL) {
    console.log(`🌍 URL Pública: ${process.env.RENDER_EXTERNAL_URL}`);
  }
});
