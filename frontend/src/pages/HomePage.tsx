import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Coordinators from '../components/Coordinators';
import Registration from '../components/Registration';
import Contact from '../components/Contact';
import FloatingSocialButtons from '../components/FloatingSocialButtons';

function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'innovative-link-expo');
  return (
    <footer className="bg-card/40 border-t border-border py-8 text-center">
      <p className="text-muted-foreground text-sm">
        © {year} Innovative Link Expo 2K26. All rights reserved.
      </p>
      <p className="text-muted-foreground text-xs mt-2">
        Built with{' '}
        <span className="text-red-500">♥</span>{' '}
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
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Coordinators />
        <Registration />
        <Contact />
      </main>
      <Footer />
      <FloatingSocialButtons />
    </div>
  );
}
