import express from 'express'
import "dotenv/config"
import userRoute from './routes/user.route'; // Adjust path accordingly
import patientRoutes from "./routes/patient.route"; // Adjust path
import doctorRoutes from "./routes/doctor.route";
import hospitalRoutes from "./routes/hospital.route";
import AppointmentRoutes from './routes/appointment.route'
import paymentRoutes from './routes/payment.route'

const app = express()
app.use(express.json());

// User ROUTE
app.use('/api/users', userRoute);

// PATION ROUTE
app.use('/api/patient', patientRoutes);
// Doctor Route
app.use("/api/doctor", doctorRoutes);
// Hospital Route
app.use("/api/hospital", hospitalRoutes);
// Appointment Route
app.use("/api/appointment", AppointmentRoutes)
// paymentRoutes
app.use('/api/payment', paymentRoutes)

app.listen(process.env.PORT, () => {
    console.log("server is running on " + process.env.PORT)
})