import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Mail, RefreshCcw } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send reset link logic
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 space-y-8 rounded-3xl shadow-2xl flex flex-col items-center">
        <RefreshCcw className="h-12 w-12 text-reel-purple-500 mb-2" />
        <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
        <p className="text-center text-muted-foreground mb-4">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleReset} className="w-full flex flex-col items-center space-y-4">
          <div className="w-full">
            <label className="text-sm font-medium" htmlFor="email">Email Address<span className="text-red-500">*</span></label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">Send Reset Link</Button>
        </form>
        <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>Back to Login</Button>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage; 