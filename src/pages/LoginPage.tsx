import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Lock, Mail, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useLogin } from '@/hooks/api/useAuthApi';
import type { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
}

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const { mutate: loginMutate, isPending } = useLogin();

  // Get the redirect path from location state, or default to '/'
  const from = (location.state as { from?: string })?.from || '/';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    loginMutate(
      { email, password },
      {
        onSuccess: () => {
          login(); // Update auth context
          navigate(from, { replace: true });
        },
        onError: (err: AxiosError<ErrorResponse>) => {
          setError(err.response?.data?.message || 'Login failed');
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6 space-y-6 rounded-3xl shadow-2xl">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-2 accent-reel-purple-500" />
              <label htmlFor="remember" className="text-sm">Remember me</label>
            </div>
            <Link to="/forgot-password" className="text-sm text-reel-purple-500 hover:underline">Forgot password?</Link>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" className="w-full" disabled={isPending}>{isPending ? 'Signing In...' : 'Sign In'}</Button>
        </form>
        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/signup" className="text-reel-purple-500 hover:underline">Sign up</Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
