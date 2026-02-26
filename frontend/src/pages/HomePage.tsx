import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import EventDetails from '../components/EventDetails';
import Coordinators from '../components/Coordinators';
import Registration from '../components/Registration';
import Contact from '../components/Contact';
import FloatingSocialButtons from '../components/FloatingSocialButtons';

export default function HomePage() {
  const currentYear = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'innovative-link-expo');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <About />
        <EventDetails />
        <Coordinators />
        <Registration />
        <Contact />
      </main>
      <footer className="bg-card border-t border-border py-6 text-center text-muted-foreground text-sm">
        <p>
          &copy; {currentYear} Innovative Link Expo. All rights reserved.
        </p>
        <p className="mt-1">
          Built with{' '}
          <span className="text-primary">♥</span>{' '}
          using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
      <FloatingSocialButtons />
    </div>
  );
}
