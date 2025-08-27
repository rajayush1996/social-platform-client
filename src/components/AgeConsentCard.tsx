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
      <DialogContent className="sm:max-w-md border-none p-0 bg-transparent">
        <Card className="bg-gradient-to-b from-pink-50 to-white border-pink-200">
          <CardHeader className="text-center space-y-2">
            <ShieldAlert className="mx-auto h-10 w-10 text-pink-600" />
            <CardTitle className="text-pink-700 text-2xl">Age Verification</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-700">
              You must be 18 or older to use this platform.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              onClick={onConfirm}
            >
              I am 18 or older
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
