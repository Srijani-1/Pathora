import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

interface AuthViewProps {
  onLogin: (email: string, name: string) => void;
}

export function AuthView({ onLogin }: AuthViewProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  // ---------- LOGIN ----------
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    const storedUsersRaw = localStorage.getItem('users');
    const storedUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

    const user = storedUsers.find(
      (u: { email: string; password: string; name: string }) =>
        u.email.toLowerCase() === loginEmail.toLowerCase()
    );

    if (!user) {
      toast.error('No account found with this email');
      return;
    }

    if (user.password !== loginPassword) {
      toast.error('Incorrect password');
      return;
    }

    // Login successful
    localStorage.setItem('logged_in_user', JSON.stringify({ email: user.email, name: user.name }));
    onLogin(user.email, user.name);
  };

  // ---------- REGISTER ----------
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (registerPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const storedUsersRaw = localStorage.getItem('users');
    const storedUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

    if (storedUsers.find((u: any) => u.email.toLowerCase() === registerEmail.toLowerCase())) {
      toast.error('An account with this email already exists');
      return;
    }

    const newUser = {
      name: registerName,
      email: registerEmail,
      password: registerPassword,
      joinedDate: new Date().toISOString(),
    };

    storedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(storedUsers));

    // Automatically log in the new user
    localStorage.setItem('logged_in_user', JSON.stringify({ email: newUser.email, name: newUser.name }));
    onLogin(newUser.email, newUser.name);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#4338ca]/10 via-background to-[#7c3aed]/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-gradient-to-br from-[#4338ca] to-[#7c3aed] rounded-2xl items-center justify-center text-white text-2xl mb-4">
            L
          </div>
          <h1 className="text-3xl mb-2">LearnPath</h1>
          <p className="text-muted-foreground">Navigate your structured skill development</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as 'login' | 'register')}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#4338ca] hover:bg-[#4338ca]/90">
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="John Doe"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="you@example.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirm Password</Label>
                    <Input
                      id="register-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#4338ca] hover:bg-[#4338ca]/90">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
