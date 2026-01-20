'use client';

import { XCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { WaitlistEntry } from '@/types/waitlist-admin';

interface RejectDialogProps {
  entry: WaitlistEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes?: string, sendEmail?: boolean) => void;
  isPending: boolean;
}

export function RejectDialog({
  entry,
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: RejectDialogProps) {
  const [notes, setNotes] = useState('');
  const [sendEmail, setSendEmail] = useState(true);

  const handleConfirm = () => {
    onConfirm(notes || undefined, sendEmail);
    setNotes('');
    setSendEmail(true);
  };

  const handleClose = () => {
    setNotes('');
    setSendEmail(true);
    onClose();
  };

  if (!entry) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="border border-gray-200 shadow-lg max-w-md rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-red-50 rounded-xl border border-red-200">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <DialogTitle
              className="text-xl font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Reject Entry
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-600">
            You're about to reject{' '}
            <strong className="text-gray-900">
              {entry.firstName} {entry.lastName}
            </strong>{' '}
            ({entry.email}).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="notes"
              className="font-semibold text-sm text-gray-700"
            >
              Rejection Reason (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Provide a reason for rejection..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-gray-300 rounded-xl min-h-24 resize-none text-sm"
              maxLength={1000}
            />
            <p className="text-xs text-gray-500">
              {notes.length}/1000 characters
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sendEmail"
              checked={sendEmail}
              onCheckedChange={(checked) => setSendEmail(checked as boolean)}
              className="border-gray-300"
            />
            <Label
              htmlFor="sendEmail"
              className="text-sm font-medium cursor-pointer text-gray-700"
            >
              Send rejection email to user
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
            className="border-gray-300 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isPending}
            className="rounded-xl bg-red-500 hover:bg-red-600 text-white"
          >
            {isPending ? 'Rejecting...' : 'Reject Entry'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
