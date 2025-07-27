import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MailCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CheckEmailPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-xl p-8 space-y-8 rounded-3xl shadow-2xl flex flex-col items-center">
        <MailCheck className="h-12 w-12 text-reel-purple-500 mb-2" />
        <h1 className="text-2xl font-bold text-center">Check Your Email</h1>
        <p className="text-center text-muted-foreground mb-4">
          A verification email has been sent to your inbox. Please check your email to activate your account.
        </p>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate('/login')}
        >
          Back to Login
        </Button>
      </Card>
    </div>
  );
};

export default CheckEmailPage;
