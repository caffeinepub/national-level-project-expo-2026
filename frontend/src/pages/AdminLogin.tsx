import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useVerifyAdminCredentials } from '../hooks/useQueries';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, Loader2, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('athiakash1977@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { adminLogin } = useAdminAuth();
  const { mutate: verifyCredentials, isPending } = useVerifyAdminCredentials();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    verifyCredentials(
      { email, password },
      {
        onSuccess: (isAdmin) => {
          if (isAdmin) {
            adminLogin();
            navigate({ to: '/admin/dashboard' });
          } else {
            setError('Access denied. You do not have admin privileges.');
          }
        },
        onError: (err: any) => {
          const msg = err?.message || '';
          if (msg.includes('Unauthorized') || msg.includes('trap')) {
            setError('Access denied. You do not have admin privileges.');
          } else {
            setError('Login failed. Please try again.');
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-card border-border shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
              <Lock className="w-7 h-7 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Admin Login</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="text"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border-border text-foreground"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-border text-foreground"
                placeholder="Enter admin password"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
