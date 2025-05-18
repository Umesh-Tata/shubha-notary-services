import { useRef } from 'react';
import './App.css';
// import BookingPage from './pages/BookingPage';
// import AppointmentManager from './pages/AppointmentManager';

function App() {
  // 🔒 Old logic preserved but disabled:
  // const [showBookingPage, setShowBookingPage] = useState(false);
  // const [activeTab, setActiveTab] = useState<'book' | 'manage'>('book');

  const contactSectionRef = useRef<HTMLDivElement>(null);

  const scrollToAppointments = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    contactSectionRef.current?.scrollIntoView({ behavior: 'smooth' });

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
  <div className="service-grid">
    {[
      'Acknowledgment statement notarization',
      'Affidavit & oath notarization',
      'Certified copy services',
      'General notarization',
      'International document notarization',
      'Loan notarization',
      'Power of attorney document notarization',
      'Property registration notarization',
      'Shipping document notarization',
      'Wills & trusts notarization',
    ].map((service) => (
      <div key={service} className="service-card">
        {service}
      </div>
    ))}
  </div>
</section>


          <section className="about">
            <h2>Why Choose Us?</h2>
            <p>
              Subha Notary Services provides professional, secure, and on-time notarization services.
              We value your time and offer both in-person and virtual notary options.
            </p>
          </section>

          {/*<section id="appointments" ref={appointmentSectionRef} className="appointments">
            <h2>My Appointments</h2>
            <AppointmentManager />
          </section> */} 

          <section id="contact" className="contact" ref={contactSectionRef}>
  <div className="contact-wrapper">
    <div className="contact-info">
      <h2>Contact Us</h2>
      <p>Email:  <a href="mailto:subhanotaryservices@gmail.com">subhanotaryservices@gmail.com</a></p>
      <p>Phone: <a href="tel:(316)456-7890">(316) 456-7890</a></p>

    </div>
    {/* add location if you want */}
    {/*<iframe
      title="Our Location"
      src=""
      width="300"
      height="200"
      style={{ border: 0, borderRadius: '10px' }}
      allowFullScreen={false}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />*/}
  </div>
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
