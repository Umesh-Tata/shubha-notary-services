import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';

// ✅ Firebase Init from environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();
const appointmentsRef = db.collection('appointments');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// POST: Book appointment
app.post('/api/appointments', async (req: Request, res: Response) => {
  const { name, phone, email, date, time, service } = req.body;

  if (!name || !phone || !date || !time || !service) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const snapshot = await appointmentsRef
      .where('date', '==', date)
      .where('time', '==', time)
      .get();

    if (!snapshot.empty) {
      return res.status(409).json({ error: 'This time slot is already booked' });
    }

    const doc = await appointmentsRef.add({ name, phone, email, date, time, service });
    res.status(201).json({ message: 'Appointment booked', id: doc.id });
  } catch (err) {
    console.error('❌ Error saving appointment:', err);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

// GET: Appointments for specific date
app.get('/api/appointments/search', async (req: Request, res: Response) => {
  const query = (req.query.q as string)?.toLowerCase();

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const snapshot = await appointmentsRef.get();
    const results = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((appt: any) =>
        appt.name?.toLowerCase() === query ||
        appt.phone?.toLowerCase() === query ||
        appt.email?.toLowerCase() === query
      );

    if (results.length === 0) {
      return res.status(404).json({ message: 'No matching appointments found' });
    }

    res.json(results);
  } catch (err) {
    console.error('❌ Search error:', err);
    res.status(500).json({ error: 'Failed to search appointments' });
  }
});

// GET: Search appointments
app.get('/api/appointments/search', async (req: Request, res: Response) => {
  const query = (req.query.q as string)?.toLowerCase();

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const snapshot = await appointmentsRef.get();
    const results = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((appt: any) =>
        appt.name?.toLowerCase().includes(query) ||
        appt.phone?.toLowerCase().includes(query) ||
        appt.email?.toLowerCase().includes(query)
      );

    res.json(results);
  } catch (err) {
    console.error('❌ Search error:', err);
    res.status(500).json({ error: 'Failed to search appointments' });
  }
});

// PATCH: Reschedule
app.patch('/api/appointments/update/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { time } = req.body;

  if (!time) {
    return res.status(400).json({ error: 'New time is required' });
  }

  try {
    const docRef = appointmentsRef.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    await docRef.update({ time });
    res.json({ message: 'Appointment updated successfully' });
  } catch (err) {
    console.error('❌ Update error:', err);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// DELETE: Remove appointment
app.delete('/api/appointments/delete/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const docRef = appointmentsRef.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    await docRef.delete();
    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
