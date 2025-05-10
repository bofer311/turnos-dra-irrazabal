const admin = require("firebase-admin");
const serviceAccount = require("../services/firebase-credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.firestore();

class FirebaseService {
  static async createAppointment(appointment) {
    try {
      const docRef = await db.collection("appointments").add({
        patientName: appointment.patientName,
        phone: appointment.phone,
        service: appointment.service,
        date: appointment.date,
        time: appointment.time,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: "pending", // pending, confirmed, cancelled, completed
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  }

  static async updateAppointmentStatus(id, status) {
    try {
      await db.collection("appointments").doc(id).update({
        status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating appointment:", error);
      throw error;
    }
  }

  static async getPendingConfirmations() {
    try {
      const snapshot = await db
        .collection("appointments")
        .where("status", "==", "pending")
        .get();

      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error getting pending appointments:", error);
      throw error;
    }
  }

  static async getUpcomingAppointments() {
    try {
      const now = new Date();
      const snapshot = await db
        .collection("appointments")
        .where("status", "==", "confirmed")
        .where("startTime", ">", now)
        .orderBy("startTime", "asc")
        .get();

      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error getting upcoming appointments:", error);
      throw error;
    }
  }
}

module.exports = FirebaseService;
