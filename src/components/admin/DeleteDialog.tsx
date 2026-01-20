'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { WaitlistEntry } from '@/types/waitlist-admin';

interface DeleteDialogProps {
  entry: WaitlistEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function DeleteDialog({
  entry,
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: DeleteDialogProps) {
  if (!entry) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border border-gray-200 shadow-lg max-w-md rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-red-50 rounded-xl border border-red-200">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <DialogTitle
              className="text-xl font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Delete Entry
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-600">
            Are you sure you want to delete the entry for{' '}
            <strong className="text-gray-900">
              {entry.firstName} {entry.lastName}
            </strong>{' '}
            ({entry.email})?
          </DialogDescription>
        </DialogHeader>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 my-4">
          <p className="text-sm font-medium text-red-900">
            ⚠️ This action cannot be undone. The entry will be permanently
            deleted from the database.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="border-gray-300 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
          >
            {isPending ? 'Deleting...' : 'Delete Entry'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
