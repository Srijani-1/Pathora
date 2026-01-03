import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface AuthViewProps {
  onLogin: (user: any) => void;
}

export function AuthView({ onLogin }: AuthViewProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Form States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerCountryCode, setRegisterCountryCode] = useState('+91');
  const [registerPhone, setRegisterPhone] = useState('');

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const countryCodes = [
    { code: '+1', country: 'USA/Canada' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'India' },
    { code: '+971', country: 'UAE' },
    { code: '+61', country: 'Australia' },
    { code: '+81', country: 'Japan' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+7', country: 'Russia' },
    { code: '+39', country: 'Italy' },
    { code: '+34', country: 'Spain' },
    { code: '+82', country: 'South Korea' },
    { code: '+86', country: 'China' },
    { code: '+55', country: 'Brazil' },
    { code: '+27', country: 'South Africa' },
    // Add more if needed
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier || !loginPassword) {
      toast.error('Please enter credentials');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: loginIdentifier.trim(), password: loginPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Login failed');

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('logged_in_user', JSON.stringify(data.user));
      toast.success('Welcome back!');
      onLogin(data.user);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Basic Field Presence Check
    if (!registerName || !registerEmail || !registerPhone || !registerPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    // 2. Email Format Validation (Proper email check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerEmail.trim())) {
      toast.error('Please enter a valid email address (e.g., name@example.com)');
      return;
    }

    // 3. Phone Number Validation (Exactly 10 digits)
    const cleanPhone = registerPhone.replace(/[^\d]/g, ''); // Remove any non-digit chars
    if (cleanPhone.length !== 10) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    // 4. Password Match Check
    if (registerPassword !== registerConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const fullPhone = registerCountryCode + cleanPhone;
      const response = await fetch('/api/register', {
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

      const data = await response.json();

      if (!response.ok) {
        // Pull the specific error message ("Email already registered", etc.) from backend
        throw new Error(data.detail || 'Registration failed');
      }

      toast.success('Account created! Please log in.');
      setActiveTab('login');

      // Reset fields
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPhone('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');

    } catch (error: any) {
      // This will now show "Email already registered" instead of "Registration failed"
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputHighlightClass = "bg-input-background border-b-2 border-b-primary/40 focus-visible:border-b-primary focus-visible:ring-0 transition-all";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">

      {/* --- GEOMETRIC BACKGROUND (10+ shapes) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 academic-grid opacity-[0.15] dark:opacity-20" />

        <div className="absolute rounded-full border border-primary/30 backdrop-blur-sm bg-gradient-to-br from-blue/20"
          style={{ top: '5%', left: '5%', width: 160, height: 160, transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -20}px)` }} />

        <div className="absolute rounded-full border border-primary/30 backdrop-blur-sm bg-gradient-to-br from-blue/20"
          style={{ top: '98%', left: '3%', width: 160, height: 160, transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -20}px)` }} />

        <div className="absolute rounded-full border border-primary/30 backdrop-blur-sm bg-gradient-to-br from-blue/20"
          style={{ top: '69%', left: '78%', width: 160, height: 160, transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -20}px)` }} />

        <div className="absolute rounded-full border border-primary/30 backdrop-blur-sm bg-gradient-to-br from-blue/20"
          style={{ top: '20%', left: '34%', width: 160, height: 160, transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -20}px)` }} />

        <div className="absolute rounded-full border border-violet/30 backdrop-blur-sm bg-gradient-to-tr from-violet/20"
          style={{ bottom: '5%', right: '5%', width: 160, height: 160, transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 20}px)` }} />

        <div className="absolute rounded-lg bg-pink/20"
          style={{ top: '10%', left: '35%', width: 80, height: 80, transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -30}px) rotate(20deg)` }} />

        <div className="absolute rounded-full bg-green/25 border border-green/20 backdrop-blur-sm"
          style={{ bottom: '15%', left: '10%', width: 64, height: 64, transform: `translate(${mousePos.x * -25}px, ${mousePos.y * 15}px)` }} />

        <div className="absolute rounded-xl bg-yellow/25 border border-yellow/20 backdrop-blur-sm"
          style={{ top: '20%', right: '20%', width: 112, height: 48, transform: `translate(${mousePos.x * 35}px, ${mousePos.y * -20}px)` }} />

        <div className="absolute rounded-xl bg-yellow/25 border border-yellow/20 backdrop-blur-sm"
          style={{ top: '25%', right: '30%', width: 112, height: 48, transform: `translate(${mousePos.x * 35}px, ${mousePos.y * -20}px)` }} />

        <div className="absolute bg-cyan/20 rotate-[30deg]"
          style={{ bottom: '10%', right: '16%', width: 80, height: 80, transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 30}px)` }} />

        <div className="absolute rounded-md border border-purple/30 bg-purple/20"
          style={{ top: '50%', left: '15%', width: 128, height: 128, transform: `translate(${mousePos.x * 15}px, ${mousePos.y * -10}px) rotate(45deg) translate(-50%, -50%)` }} />

        <div className="absolute rounded-xl bg-yellow/25 border border-yellow/20 backdrop-blur-sm"
          style={{ top: '34%', right: '20%', width: 112, height: 48, transform: `translate(${mousePos.x * 35}px, ${mousePos.y * -20}px)` }} />

        <div className="absolute rounded-xl bg-red/20"
          style={{ top: '33%', left: '3%', width: 80, height: 80, transform: `translate(${mousePos.x * 20}px, ${mousePos.y * -10}px)` }} />

        <div className="absolute rounded-full border border-blue/30 bg-blue/20 backdrop-blur-sm"
          style={{ top: '50%', right: '33%', width: 96, height: 96, transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 25}px)` }} />

        <div className="absolute rounded-xl bg-red/20"
          style={{ top: '33%', right: '33%', width: 80, height: 80, transform: `translate(${mousePos.x * 20}px, ${mousePos.y * -10}px)` }} />

        <div className="absolute rounded-xl bg-red/20"
          style={{ bottom: '33%', right: '33%', width: 80, height: 80, transform: `translate(${mousePos.x * 20}px, ${mousePos.y * -10}px)` }} />

        <div className="absolute rounded-xl bg-red/20"
          style={{ top: '24%', left: '33%', width: 80, height: 80, transform: `translate(${mousePos.x * 20}px, ${mousePos.y * -10}px)` }} />

        <div className="absolute rounded-lg bg-green/15"
          style={{ bottom: '33%', left: '50%', width: 112, height: 48, transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -20}px)` }} />

        <div className="absolute rounded-full bg-pink/15 border border-pink/25"
          style={{ top: '15%', left: '60%', width: 64, height: 64, transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 10}px)` }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex w-14 h-14 bg-primary rounded-2xl items-center justify-center text-primary-foreground text-2xl mb-4 shadow-xl border-b-4 border-primary/40 font-bold">
            P
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Pathora</h1>
        </div>

        <Card className="border-border bg-card/95 dark:bg-card/90 backdrop-blur-2xl shadow-2xl relative overflow-hidden border-t-0">

          {/* TOP HIGHLIGHT BAR */}
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-blue via-violet to-blue z-50" />

          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Authentication</CardTitle>
            <CardDescription>Master your learning journey</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 p-1 border border-border">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {/* LOGIN FORM */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email or Phone</Label>
                    <Input
                      placeholder="you@example.com"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className={inputHighlightClass}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="relative">
                      <Input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className={`${inputHighlightClass} pr-10`}
                        disabled={isLoading}
                      />
                      <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-primary font-semibold" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Log In
                  </Button>
                </form>
              </TabsContent>

              {/* REGISTER FORM */}
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Full Name</Label>
                    <Input value={registerName} placeholder="Jane Doe" className={`${inputHighlightClass} h-9`} onChange={(e) => setRegisterName(e.target.value)} disabled={isLoading} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Email</Label>
                    <Input type="email" value={registerEmail} placeholder="jane@example.com" className={`${inputHighlightClass} h-9`} onChange={(e) => setRegisterEmail(e.target.value)} disabled={isLoading} />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Phone Number</Label>
                    <div className="flex gap-2">
                      <Select value={registerCountryCode} onValueChange={setRegisterCountryCode} disabled={isLoading}>
                        <SelectTrigger className="w-24 bg-input-background border-border border-b-2 border-b-primary/40 h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover/98 backdrop-blur-xl border-border z-[100] max-h-[200px]">
                          {countryCodes.map(cc => (
                            <SelectItem key={cc.code} value={cc.code}>{cc.code} ({cc.country})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input placeholder="1234567890" value={registerPhone} className={`${inputHighlightClass} flex-1 h-9`} onChange={(e) => setRegisterPhone(e.target.value)} disabled={isLoading} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Password</Label>
                      <div className="relative">
                        <Input type={showRegisterPassword ? 'text' : 'password'} value={registerPassword} className={`${inputHighlightClass} h-9 pr-10`} onChange={(e) => setRegisterPassword(e.target.value)} disabled={isLoading} />
                        <button type="button" onClick={() => setShowRegisterPassword(!showRegisterPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {showRegisterPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Confirm</Label>
                      <div className="relative">
                        <Input
                          type={showRegisterConfirmPassword ? 'text' : 'password'}
                          value={registerConfirmPassword}
                          className={`${inputHighlightClass} h-9 pr-10`}
                          onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showRegisterConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-primary mt-2 font-semibold" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Register
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
