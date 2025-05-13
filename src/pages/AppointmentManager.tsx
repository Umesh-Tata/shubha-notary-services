import { useState } from 'react';
import { API_BASE_URL } from '../config';

type Appointment = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  service: string;
};

const AppointmentManager = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newTime, setNewTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [status, setStatus] = useState('');

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments/search?q=${query}`);
      const data = await res.json();
      setResults(data);
      setStatus('');
    } catch (err) {
      console.error(err);
      setStatus('❌ Error finding appointments.');
    }
  };

  const handleRescheduleClick = async (appt: Appointment) => {
    setSelectedAppointment(appt);
    setNewTime('');
    setStatus('Loading available times...');

    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments?date=${appt.date}`);
      const booked = await res.json();
      const bookedTimes = booked.map((b: Appointment) => b.time);

      const allTimes: string[] = [];
      for (let hour = 7; hour <= 22; hour++) {
        const suffix = hour < 12 ? 'AM' : 'PM';
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        allTimes.push(`${displayHour}:00 ${suffix}`);
        allTimes.push(`${displayHour}:30 ${suffix}`);
      }

      const available = allTimes.filter((t) => !bookedTimes.includes(t));
      setAvailableTimes(available);
      setStatus('');
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to load available times.');
    }
  };

  const handleUpdate = async () => {
    if (!selectedAppointment || !newTime) return;
    setStatus('Updating...');

    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments/update/${selectedAppointment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time: newTime })
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('✅ Appointment updated!');
        setSelectedAppointment(null);
        fetchAppointments();
      } else {
        setStatus(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to update appointment.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Find Your Appointment</h3>
      <input
        placeholder="Enter name, phone, or email"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
      />
      <button onClick={fetchAppointments} className="confirm-btn">Search</button>
      {status && <p>{status}</p>}

      {results.length > 0 && (
        <ul style={{ marginTop: '20px', paddingLeft: 0 }}>
          {results.map((appt) => (
            <li key={appt.id} style={{ listStyle: 'none', marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              <p><strong>Name:</strong> {appt.name}</p>
              <p><strong>Phone:</strong> {appt.phone}</p>
              <p><strong>Service:</strong> {appt.service}</p>
              <p><strong>Date:</strong> {appt.date}</p>
              <p><strong>Time:</strong> {appt.time}</p>
              <button onClick={() => handleRescheduleClick(appt)} className="confirm-btn">
                Reschedule
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedAppointment && (
        <>
          <h3>Reschedule for {selectedAppointment.date}</h3>
          <select
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            style={{ padding: '8px', width: '100%' }}
          >
            <option value="">Select new time</option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          <button onClick={handleUpdate} className="confirm-btn" style={{ marginTop: '10px' }}>
            Confirm Reschedule
          </button>
        </>
      )}
    </div>
  );
};

export default AppointmentManager;
