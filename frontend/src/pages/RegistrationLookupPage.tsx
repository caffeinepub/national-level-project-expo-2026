import { useState } from 'react';
import Navbar from '../components/Navbar';
import FloatingSocialButtons from '../components/FloatingSocialButtons';
import { useGetRegistrationByEmail } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function RegistrationLookupPage() {
  const [email, setEmail] = useState('');
  const [searched, setSearched] = useState(false);
  const { mutate: searchByEmail, data: registration, isPending, isError, reset } = useGetRegistrationByEmail();
  const currentYear = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'innovative-link-expo');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSearched(true);
    searchByEmail(email.trim());
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (searched) {
      setSearched(false);
      reset();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-16 px-4 max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary mb-3">Check Registration</h1>
          <p className="text-muted-foreground text-lg">
            Enter your email address to verify your registration status
          </p>
        </div>

        <Card className="bg-card border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Registration Lookup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-3 mb-6">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={handleEmailChange}
                className="flex-1 bg-background border-border text-foreground placeholder:text-muted-foreground"
                required
              />
              <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </form>

            {isError && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive">
                <XCircle className="w-5 h-5 flex-shrink-0" />
                <p>An error occurred while searching. Please try again.</p>
              </div>
            )}

            {searched && !isPending && !isError && registration === null && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted border border-border text-muted-foreground">
                <XCircle className="w-5 h-5 flex-shrink-0 text-destructive" />
                <p>No registration found for <strong>{email}</strong>. Please check your email and try again.</p>
              </div>
            )}

            {searched && !isPending && !isError && registration && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/30 text-primary">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="font-semibold">Registration confirmed!</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name', value: registration.fullName },
                    { label: 'Email', value: registration.email },
                    { label: 'Phone', value: registration.phoneNumber },
                    { label: 'College', value: registration.collegeName },
                    { label: 'Department', value: registration.department },
                    { label: 'Project Title', value: registration.projectTitle },
                    { label: 'Category', value: registration.category },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-muted/50 rounded-lg p-3 border border-border">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
                      <p className="text-foreground font-medium text-sm">{value}</p>
                    </div>
                  ))}
                  <div className="sm:col-span-2 bg-muted/50 rounded-lg p-3 border border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Abstract</p>
                    <p className="text-foreground text-sm">{registration.abstract}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <footer className="bg-card border-t border-border py-6 text-center text-muted-foreground text-sm">
        <p>&copy; {currentYear} Innovative Link Expo. All rights reserved.</p>
        <p className="mt-1">
          Built with <span className="text-primary">♥</span> using{' '}
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
