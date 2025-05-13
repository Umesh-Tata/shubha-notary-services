import { useState, useEffect } from 'react';
import { format, setHours, setMinutes, isAfter, addHours } from 'date-fns';
import { API_BASE_URL } from '../config';

const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let hour = 7; hour <= 22; hour++) {
    const suffix = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    slots.push(`${displayHour}:00 ${suffix}`);
    slots.push(`${displayHour}:30 ${suffix}`);
  }
  return slots;
};

const parseTime = (dateStr: string, timeStr: string): Date => {
  const [raw, suffix] = timeStr.split(' ');
  const [hourStr, minuteStr] = raw.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  if (suffix === 'PM' && hour !== 12) hour += 12;
  if (suffix === 'AM' && hour === 12) hour = 0;
  const date = new Date(`${dateStr}T00:00:00`);
  return setMinutes(setHours(date, hour), minute);
};

const getInitialDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const BookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(getInitialDate());
  const [selectedTime, setSelectedTime] = useState('');
  const [service, setService] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);

  const timeSlots = generateTimeSlots();

  const isSlotValid = (dateStr: string, timeStr: string): boolean => {
    const now = new Date();
    const slotTime = parseTime(dateStr, timeStr);
    return isAfter(slotTime, addHours(now, 1));
  };

  const availableTimeSlots = timeSlots.filter(
    (time) => isSlotValid(selectedDate, time) && !bookedTimes.includes(time)
  );

  const hasAvailableSlots = availableTimeSlots.length > 0;

  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/appointments?date=${selectedDate}`);
        const data = await res.json();
        const times = data.map((appt: { time: string }) => appt.time);
        setBookedTimes(times);
      } catch (err) {
        console.error('Failed to fetch booked slots:', err);
        setBookedTimes([]);
      }
    };

    fetchBookedSlots();
  }, [selectedDate]);

  const handleTimeClick = (time: string) => {
    setMessage('');
    setSelectedTime(time);
  };

  const handleConfirm = async () => {
    if (!name || !phone || !selectedDate || !selectedTime || !service) {
      setMessage('❌ Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setMessage('');

    const appointment = {
      name,
      phone,
      email,
      date: selectedDate,
      time: selectedTime,
      service
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment)
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('✅ Appointment confirmed!');
        setName('');
        setPhone('');
        setEmail('');
        setSelectedTime('');
        setService('');
        setBookedTimes([...bookedTimes, selectedTime]);
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage('❌ Failed to connect to server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-container">
      <div className="calendar-section">
        <h2>Select Date</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setSelectedTime('');
            setMessage('');
          }}
        />

        <h2 style={{ marginTop: '20px' }}>
          {format(new Date(`${selectedDate}T00:00:00`), 'eeee, MMMM d, yyyy')}
        </h2>

        {!hasAvailableSlots && (
          <p style={{ color: 'red', marginTop: '10px' }}>
            No available slots for this date. Please choose another.
          </p>
        )}

        <div className="times">
          {availableTimeSlots.map((time) => (
            <button
              key={time}
              onClick={() => handleTimeClick(time)}
              className={`time-btn ${selectedTime === time ? 'active' : ''}`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      <div className="summary-section">
        <h3>Appointment Details</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ width: '80px' }}>Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ flex: 1, padding: '8px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ width: '80px' }}>Phone *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={{ flex: 1, padding: '8px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ width: '80px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ flex: 1, padding: '8px' }}
            />
          </div>
        </div>

        <p><strong>Date:</strong> {format(new Date(`${selectedDate}T00:00:00`), 'PPP')}</p>
        <p><strong>Time:</strong> {selectedTime || 'Not selected'}</p>

        <label><strong>Service:</strong></label>
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          required
          style={{ marginTop: '10px', marginBottom: '20px', width: '100%', padding: '8px' }}
        >
          <option value="">Select a service</option>
          <option value="Notarization">Notarization</option>
          <option value="Real Estate Closing">Real Estate Closing</option>
          <option value="Mobile Notary">Mobile Notary</option>
          <option value="Power of Attorney">Power of Attorney</option>
        </select>

        <button
          disabled={!selectedTime || !service || !name || !phone || submitting}
          className="confirm-btn"
          onClick={handleConfirm}
        >
          {submitting ? 'Submitting...' : 'Confirm Appointment'}
        </button>

        {message && <p style={{ marginTop: '10px' }}>{message}</p>}
      </div>
    </div>
  );
};

export default BookingPage;
