import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

interface AgeConsentCardProps {
  open: boolean;
  onConfirm: () => void;
}

export default function AgeConsentCard({ open, onConfirm }: AgeConsentCardProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-xl border-none p-0 bg-transparent">
        <Card className="bg-gradient-to-b from-pink-50 to-white border-pink-200">
          <CardHeader className="text-center space-y-2">
            <ShieldAlert className="mx-auto h-10 w-10 text-pink-600" />
            <CardTitle className="text-pink-700 text-2xl">Adults Only</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 text-sm">
            <p>
              The content available on this site may include sexually explicit
              material. Access is limited to individuals 18 years of age or
              older, or the age of majority in your jurisdiction.
            </p>
            <p>
              By entering, you confirm that you are of legal age and agree to
              take steps to prevent minors from accessing this site using
              parental controls or other safeguards.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 sm:flex-row">
            <Button
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              onClick={onConfirm}
            >
              I am 18 or older
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => (window.location.href = 'https://www.google.com')}
            >
              Leave site
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
