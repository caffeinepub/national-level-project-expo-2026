import Navbar from '../components/Navbar';
import EventDetails from '../components/EventDetails';
import Footer from '../components/Footer';

export default function EventDetailsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <EventDetails />
      </main>
      <Footer />
    </>
  );
}
