import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Coordinators from '../components/Coordinators';
import Registration from '../components/Registration';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Coordinators />
        <Registration />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
