import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  service: { type: String, required: true },
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', AppointmentSchema);

export default Appointment;
