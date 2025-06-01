import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MailCheck, ArrowLeft } from 'lucide-react';
import { useResendVerification } from '@/hooks/api/useAuthApi';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

interface ErrorResponse {
  message: string;
}

const VerificationIdentityPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { mutate: resendVerification, isPending } = useResendVerification();

  const handleResend = (e: React.FormEvent) => {
    e.preventDefault();
    resendVerification(email, {
      onSuccess: () => {
        toast.success('Verification email sent successfully!');
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        toast.error(error.response?.data?.message || 'Failed to send verification email');
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-xl p-8 space-y-8 rounded-3xl shadow-2xl flex flex-col items-center">
        <MailCheck className="h-12 w-12 text-reel-purple-500 mb-2" />
        <h1 className="text-2xl font-bold text-center">Verify Your Email</h1>
        <p className="text-center text-muted-foreground mb-4">
          A verification link has been sent to your email. Please check your inbox and click the link to activate your account.<br />
          If your verification link has expired or you did not receive the email, you can resend the verification email below.
        </p>
        <form onSubmit={handleResend} className="w-full flex flex-col items-center space-y-4">
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
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Sending...' : 'Resend Verification Email'}
          </Button>
        </form>
        <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>Back to Login</Button>
      </Card>
    </div>
  );
};

export default VerificationIdentityPage; 