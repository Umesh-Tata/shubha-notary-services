import { useRef, useState } from 'react';
import './App.css';
// import BookingPage from './pages/BookingPage';
import AppointmentManager from './pages/AppointmentManager';

function App() {
  // 🔒 Old logic preserved but disabled:
  // const [showBookingPage, setShowBookingPage] = useState(false);
  // const [activeTab, setActiveTab] = useState<'book' | 'manage'>('book');

  const appointmentSectionRef = useRef<HTMLDivElement>(null);

  const scrollToAppointments = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    appointmentSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // const handleBookingClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  //   e.preventDefault();
  //   setShowBookingPage(true);
  // };

  // const handleBackClick = () => {
  //   setShowBookingPage(false);
  //   setActiveTab('book');
  // };

  return (
    <div className="app">
      {/* {!showBookingPage ? ( */}
        <>
          <header className="hero">
            <h1>Shubha Notary Services</h1>
            <p>Reliable. Certified. Convenient.</p>
            <a href="#appointments" className="btn-primary" onClick={scrollToAppointments}>
              Book an Appointment
            </a>
          </header>

          <section className="services">
            <h2>Our Services</h2>
            <ul>
              <li>Document Notarization</li>
              <li>Real Estate Closings</li>
              <li>Mobile Notary Visits</li>
              <li>Power of Attorney</li>
            </ul>
          </section>

          <section className="about">
            <h2>Why Choose Us?</h2>
            <p>
              Subha Notary Services provides professional, secure, and on-time notarization services.
              We value your time and offer both in-person and virtual notary options.
            </p>
          </section>

          <section id="appointments" ref={appointmentSectionRef} className="appointments">
            <h2>My Appointments</h2>
            <AppointmentManager />
          </section>

          <section id="contact" className="contact">
            <h2>Contact Us</h2>
            <p>Email: subhanotaryservices@gmail.com</p>
            <p>Phone: (316) 456-7890</p>
          </section>

          <footer>
            <p>&copy; {new Date().getFullYear()} Subha Notary Services</p>
          </footer>
        </>
      {/* ) : (
        <>
          <button className="btn-primary" onClick={handleBackClick} style={{ margin: '20px' }}>
            ← Back to Home
          </button>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
            <button
              className={`btn-primary ${activeTab === 'book' ? 'active' : ''}`}
              onClick={() => setActiveTab('book')}
            >
              Book Appointment
            </button>
            <button
              className={`btn-primary ${activeTab === 'manage' ? 'active' : ''}`}
              onClick={() => setActiveTab('manage')}
            >
              My Appointments
            </button>
          </div>

          {activeTab === 'book' ? <BookingPage /> : <AppointmentManager />}
        </>
      )} */}
    </div>
  );
}

export default App;
