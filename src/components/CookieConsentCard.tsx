import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';

interface CookieConsentCardProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function CookieConsentCard({
  open,
  onAccept,
  onDecline,
}: CookieConsentCardProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md border-none p-0 bg-transparent">
        <VisuallyHidden>
          <DialogTitle>Cookie consent</DialogTitle>
        </VisuallyHidden>
        <Card className="bg-pink-50 border-pink-200">
          <CardContent className="p-4 flex items-start gap-3">
            <Cookie className="h-5 w-5 text-pink-600 mt-1" />
            <p className="text-sm text-gray-700">
              We use cookies to improve your experience. You can accept or decline
              our use of cookies.
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={onDecline}>
              Decline
            </Button>
            <Button
              size="sm"
              className="bg-pink-600 hover:bg-pink-700 text-white"
              onClick={onAccept}
            >
              Accept
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
