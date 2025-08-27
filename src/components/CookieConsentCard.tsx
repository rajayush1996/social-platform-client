import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';

interface CookieConsentCardProps {
  onAccept: () => void;
}

export default function CookieConsentCard({ onAccept }: CookieConsentCardProps) {
  return (
    <div className="flex justify-center p-4">
      <Card className="w-full max-w-md bg-pink-50 border-pink-200">
        <CardContent className="p-4 flex items-start gap-3">
          <Cookie className="h-5 w-5 text-pink-600 mt-1" />
          <p className="text-sm text-gray-700">
            We use cookies to improve your experience. By continuing, you accept our cookie policy.
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-end">
          <Button
            size="sm"
            className="bg-pink-600 hover:bg-pink-700 text-white"
            onClick={onAccept}
          >
            Accept
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
