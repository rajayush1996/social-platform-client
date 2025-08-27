import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AgeConsentCardProps {
  open: boolean;
  onConfirm: () => void;
}

export default function AgeConsentCard({ open, onConfirm }: AgeConsentCardProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Age Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You must be 18 or older to use this platform.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={onConfirm}>
              I am 18 or older
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
