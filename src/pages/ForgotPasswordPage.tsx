import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { RefreshCcw } from 'lucide-react';
import { toast } from 'sonner'; // Assuming you're using Sonner for toasts
import { useForgotPassword } from '@/hooks/api/useAuthApi'; // Importing the custom hook

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const { mutateAsync, isPending: isLoading, isError, error } = useForgotPassword(); // Use mutateAsync
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the email is valid
    if (!email) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      // Use mutateAsync to ensure it resolves as a promise
      await mutateAsync(email);

      // Show success message once the mutation is successful
      toast.success('Reset link sent successfully! Please check your email.');

      // Wait for the mutation to complete before navigating
      navigate('/check-email'); // Navigate after successful completion
    } catch (err) {
      // If there's an error, show an error toast
      toast.error('Failed to send reset link. Please try again.');
    }
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
        <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>Back to Login</Button>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
