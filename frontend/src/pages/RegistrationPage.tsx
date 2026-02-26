import Navbar from '../components/Navbar';
import Registration from '../components/Registration';
import Footer from '../components/Footer';
import FloatingSocialButtons from '../components/FloatingSocialButtons';
import ScrollProgressBar from '../components/ScrollProgressBar';

export default function RegistrationPage() {
  return (
    <div className="min-h-screen" style={{ background: '#050f0a' }}>
      <ScrollProgressBar />
      <Navbar />
      <main className="pt-20">
        <Registration />
      </main>
      <Footer />
      <FloatingSocialButtons />
    </div>
  );
}
