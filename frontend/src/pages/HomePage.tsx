import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import EventDetails from '../components/EventDetails';
import Coordinators from '../components/Coordinators';
import Registration from '../components/Registration';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import FloatingSocialButtons from '../components/FloatingSocialButtons';
import ScrollProgressBar from '../components/ScrollProgressBar';

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: '#050f0a' }}>
      <ScrollProgressBar />
      <Navbar />
      <main>
        <Hero />
        <About />
        <EventDetails />
        <Coordinators />
        <Registration />
        <Contact />
      </main>
      <Footer />
      <FloatingSocialButtons />
    </div>
  );
}
