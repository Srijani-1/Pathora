"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

interface AuthViewProps {
  onLogin: (email: string, name: string) => void;
}

export function AuthView({ onLogin }: AuthViewProps) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword)
      return toast.error("Please fill in all fields");
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: loginEmail, password: loginPassword }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Login failed");
      }
      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("logged_in_user", JSON.stringify(data.user));
      toast.success("Welcome back!");
      onLogin(data.user.email, data.user.full_name);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !registerName ||
      !registerEmail ||
      !registerPassword ||
      !registerConfirmPassword ||
      !registerPhone
    ) {
      return toast.error("Please fill in all fields");
    }
    if (registerPassword !== registerConfirmPassword)
      return toast.error("Passwords do not match");
    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: registerName,
          email: registerEmail,
          password: registerPassword,
          phone: registerPhone,
          role: "Student",
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Registration failed");
      }
      toast.success("Account created successfully");
      setActiveTab("login");
      setLoginEmail(registerEmail);
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterConfirmPassword("");
      setRegisterPhone("");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b dark:from-[#0b1236] dark:to-[#0f1a3a] from-blue-50 to-indigo-50 transition-colors duration-500">
      {/* Background partitions */}
      <div className="absolute inset-0">
        <div className="absolute -bottom-40 w-[200%] h-[200px] bg-gradient-to-r from-indigo-500/20 via-blue-400/20 to-purple-500/20 rounded-full blur-sm"></div>
        <div className="absolute -top-32 w-[250%] h-[250px] bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-full blur-sm"></div>
        <div className="absolute top-1/3 left-[-20%] w-[150%] h-[150px] bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-indigo-400/20 rounded-full blur-sm"></div>
      </div>

      <div className="w-full max-w-md px-4 z-10">
        {/* Logo */}
        <div className="text-center mb-8 relative z-10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-xl font-semibold shadow-lg">
            L
          </div>
          <h1 className="text-3xl font-semibold dark:text-white text-gray-900 drop-shadow-lg">
            LearnPath
          </h1>
          <p className="dark:text-white/80 text-gray-700 mt-1 drop-shadow-md">
            Build your learning journey step by step
          </p>
        </div>

        {/* Card */}
        <Card className="bg-card dark:bg-gray-800/80 border border-border dark:border-gray-700/60 shadow-lg relative z-10 transition-colors duration-500">
          <CardHeader>
            <CardTitle className="dark:text-white text-gray-900">Welcome</CardTitle>
            <CardDescription className="dark:text-white/70 text-gray-600">
              Login or create a new account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger
                  value="login"
                  className={`transition-all duration-300 ${
                    activeTab === "login"
                      ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg"
                      : "hover:bg-indigo-100 dark:hover:bg-indigo-700/50"
                  }`}
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className={`transition-all duration-300 ${
                    activeTab === "register"
                      ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg"
                      : "hover:bg-indigo-100 dark:hover:bg-indigo-700/50"
                  }`}
                >
                  Register
                </TabsTrigger>
              </TabsList>

              {/* LOGIN */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label className="dark:text-white text-gray-900">Email</Label>
                    <Input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="bg-white dark:bg-gray-700 border border-border dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 pr-10"
                    />
                  </div>

                  <div>
                    <Label className="dark:text-white text-gray-900">Password</Label>
                    <div className="relative">
                      <Input
                        type={showLoginPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="bg-white dark:bg-gray-700 border border-border dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button className="w-full bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-500 dark:hover:bg-indigo-400 text-white">
                    Log In
                  </Button>
                </form>
              </TabsContent>

              {/* REGISTER */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label className="dark:text-white text-gray-900">Full Name</Label>
                    <Input
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      placeholder="Enter full name"
                      className="bg-white dark:bg-gray-700 border border-border dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300"
                    />
                  </div>
                  <div>
                    <Label className="dark:text-white text-gray-900">Email</Label>
                    <Input
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="Enter email"
                      className="bg-white dark:bg-gray-700 border border-border dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300"
                    />
                  </div>
                  <div>
                    <Label className="dark:text-white text-gray-900">Phone</Label>
                    <Input
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      placeholder="Enter phone"
                      className="bg-white dark:bg-gray-700 border border-border dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300"
                    />
                  </div>
                  <div>
                    <Label className="dark:text-white text-gray-900">Password</Label>
                    <div className="relative">
                      <Input
                        type={showRegisterPassword ? "text" : "password"}
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder="Enter password"
                        className="bg-white dark:bg-gray-700 border border-border dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300"
                      >
                        {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label className="dark:text-white text-gray-900">Confirm Password</Label>
                    <Input
                      type="password"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="bg-white dark:bg-gray-700 border border-border dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300"
                    />
                  </div>

                  <Button className="w-full bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-500 dark:hover:bg-indigo-400 text-white">
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
