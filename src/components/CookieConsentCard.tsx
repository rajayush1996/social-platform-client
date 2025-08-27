import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CookieConsentCardProps {
  open: boolean;
  onAccept: () => void;
}

export default function CookieConsentCard({ open, onAccept }: CookieConsentCardProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Cookie Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>We use cookies to improve your experience. By continuing, you accept our cookie policy.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={onAccept}>
              Accept
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
