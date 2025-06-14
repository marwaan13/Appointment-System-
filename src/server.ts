import express from 'express'
import "dotenv/config"
import userRoute from './routes/user.route'; // Adjust path accordingly
import patientRoutes from "./routes/patient.route"; // Adjust path

const app = express()
app.use(express.json());

// User ROUTE
app.use('/api/users', userRoute);

// PATION ROUTE
app.use("/api/patients", patientRoutes);



app.listen(process.env.PORT, () => {
    console.log("server is running on " + process.env.PORT)
})