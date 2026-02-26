import Navbar from '../components/Navbar';
import About from '../components/About';
import Footer from '../components/Footer';
import FloatingSocialButtons from '../components/FloatingSocialButtons';
import ScrollProgressBar from '../components/ScrollProgressBar';

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: '#050f0a' }}>
      <ScrollProgressBar />
      <Navbar />
      <main className="pt-20">
        <About />
      </main>
      <Footer />
      <FloatingSocialButtons />
    </div>
  );
}
