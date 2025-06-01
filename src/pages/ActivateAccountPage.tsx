import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MailCheck, ArrowLeft } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import { Link } from 'react-router-dom';
import type { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
}

const ActivateAccountPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const { mutate: verifyEmail } = useMutation({
    mutationFn: async (token: string) => {
      const { data } = await axiosInstance.get(API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL, {
        params: { token }
      });
      return data;
    },
    onSuccess: () => {
      setVerificationStatus('success');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      setVerificationStatus('error');
      setErrorMessage(error.response?.data?.message || 'Failed to verify email. Please try again.');
    },
  });

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setVerificationStatus('error');
      setErrorMessage('Invalid verification link. Please request a new verification email.');
      return;
    }
    verifyEmail(token);
  }, [searchParams, verifyEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-xl p-8 space-y-8 rounded-3xl shadow-2xl flex flex-col items-center">
        <MailCheck className={`h-12 w-12 ${verificationStatus === 'success' ? 'text-green-500' : verificationStatus === 'error' ? 'text-red-500' : 'text-reel-purple-500'} mb-2`} />
        
        {verificationStatus === 'loading' && (
          <>
            <h1 className="text-2xl font-bold text-center">Verifying Your Email</h1>
            <p className="text-center text-muted-foreground">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {verificationStatus === 'success' && (
          <>
            <h1 className="text-2xl font-bold text-center">Email Verified Successfully!</h1>
            <p className="text-center text-muted-foreground">
              Your email has been verified. You can now log in to your account.
            </p>
            <Button onClick={() => navigate('/login')} className="w-full">
              Go to Login
            </Button>
          </>
        )}

        {verificationStatus === 'error' && (
          <>
            <h1 className="text-2xl font-bold text-center">Verification Failed</h1>
            <p className="text-center text-muted-foreground">
              {errorMessage}
            </p>
            <div className="flex flex-col space-y-4 w-full">
              <Link to="/verify-identity" className="w-full">
                <Button variant="outline" className="w-full">
                  Request New Verification Email
                </Button>
              </Link>
              <Link to="/login" className="w-full">
                <Button className="w-full">
                  Back to Login
                </Button>
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ActivateAccountPage; 