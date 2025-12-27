import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface AuthViewProps {
  onLogin: (email: string, name: string) => void;
}

export function AuthView({ onLogin }: AuthViewProps) {
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerCountryCode, setRegisterCountryCode] = useState('+91'); // Default India
  const [registerPhone, setRegisterPhone] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  // --- ADDED THIS STATE ---
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  // Validation error states
  const [loginIdentifierError, setLoginIdentifierError] = useState('');
  const [registerEmailError, setRegisterEmailError] = useState('');
  const [registerPhoneError, setRegisterPhoneError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const countryCodes = [
    { code: '+91', country: 'India' },
    { code: '+1', country: 'United States' },
    { code: '+44', country: 'United Kingdom' },
    { code: '+61', country: 'Australia' },
    { code: '+81', country: 'Japan' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+86', country: 'China' },
    { code: '+55', country: 'Brazil' },
    { code: '+7', country: 'Russia' },
  ];

  const validateLoginIdentifier = (value: string) => {
    if (value.trim() === '') {
      setLoginIdentifierError('');
      return;
    }

    if (value.includes('@')) {
      if (!emailRegex.test(value)) {
        setLoginIdentifierError('Invalid email format. Example: name@example.com');
      } else {
        setLoginIdentifierError('');
      }
    } else {
      const digits = value.replace(/[^\d]/g, '');
      if (digits.length > 0 && digits.length !== 10) {
        setLoginIdentifierError('Phone number must have exactly 10 digits');
      } else {
        setLoginIdentifierError('');
      }
    }
  };

  const validateRegisterEmail = (value: string) => {
    if (value.trim() === '') {
      setRegisterEmailError('');
      return;
    }
    if (!emailRegex.test(value)) {
      setRegisterEmailError('Invalid email format. Example: name@example.com');
    } else {
      setRegisterEmailError('');
    }
  };

  const validateRegisterPhone = (value: string) => {
    const digits = value.replace(/[^\d]/g, '');
    if (digits.length > 0 && digits.length !== 10) {
      setRegisterPhoneError('Phone number must have exactly 10 digits');
    } else {
      setRegisterPhoneError('');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (loginIdentifierError) {
      toast.error(loginIdentifierError);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: loginIdentifier.trim(), password: loginPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('logged_in_user', JSON.stringify(data.user));

      toast.success('Welcome back! 🎉');
      onLogin(data.user.email, data.user.full_name);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName.trim() || !registerEmail.trim() || !registerPassword || !registerConfirmPassword || !registerPhone.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    if (registerEmailError || registerPhoneError) {
      toast.error('Please fix the errors in the form');
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

    const cleanedPhoneDigits = registerPhone.replace(/[^\d]/g, '');
    const fullPhone = registerCountryCode + cleanedPhoneDigits;

    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: registerName.trim(),
          email: registerEmail.trim(),
          password: registerPassword,
          phone: fullPhone,
          role: 'Student'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
      }

      toast.success('Account created successfully! 🎉 Please login.');
      setActiveTab('login');
      setLoginIdentifier(registerEmail);
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');
      setRegisterPhone('');
      setRegisterCountryCode('+91');
      setRegisterEmailError('');
      setRegisterPhoneError('');
      // --- RESET STATE ---
      setShowRegisterConfirmPassword(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl items-center justify-center text-white text-2xl mb-4 shadow-2xl">
            L
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Pathora</h1>
          <p className="text-white/70">Navigate your structured skill development</p>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">Welcome</CardTitle>
            <CardDescription className="text-white/60">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger
                  value="login"
                  // Added 'text-white/60' as the base color
                  className="text-white/60 data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  // Added 'text-white/60' as the base color
                  className="text-white/60 data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="login-identifier" className="text-white/90">Email or Phone</Label>
                    <Input
                      id="login-identifier"
                      type="text"
                      placeholder="you@example.com or 1234567890"
                      value={loginIdentifier}
                      onChange={(e) => {
                        setLoginIdentifier(e.target.value);
                        validateLoginIdentifier(e.target.value);
                      }}
                      className={`bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-cyan-400 ${loginIdentifierError ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                    {loginIdentifierError && (
                      <p className="text-red-400 text-sm mt-1">{loginIdentifierError}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-white/90">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showLoginPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 shadow-lg">
                    Log In
                  </Button>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="text-white/90">Full Name</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="John Doe"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-cyan-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-white/90">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="you@example.com"
                      value={registerEmail}
                      onChange={(e) => {
                        setRegisterEmail(e.target.value);
                        validateRegisterEmail(e.target.value);
                      }}
                      className={`bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-cyan-400 ${registerEmailError ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                    {registerEmailError && (
                      <p className="text-red-400 text-sm mt-1">{registerEmailError}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/90">Phone Number</Label>
                    <div className="flex gap-3">
                      <Select value={registerCountryCode} onValueChange={setRegisterCountryCode}>
                        <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Code" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/20">
                          {countryCodes.map((cc) => (
                            <SelectItem key={cc.code} value={cc.code} className="text-white hover:bg-white/10">
                              {cc.country} ({cc.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex-1">
                        <Input
                          type="tel"
                          placeholder="1234567890"
                          value={registerPhone}
                          onChange={(e) => {
                            setRegisterPhone(e.target.value);
                            validateRegisterPhone(e.target.value);
                          }}
                          className={`bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-cyan-400 ${registerPhoneError ? 'border-red-500 focus:border-red-500' : ''}`}
                        />
                        {registerPhoneError && (
                          <p className="text-red-400 text-sm mt-1">{registerPhoneError}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-white/90">Password</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showRegisterPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                      >
                        {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* --- UPDATED CONFIRM PASSWORD SECTION --- */}
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password" className="text-white/90">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="register-confirm-password"
                        type={showRegisterConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        className="pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                      >
                        {showRegisterConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 shadow-lg">
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
