'use client';

import { format } from 'date-fns';
import {
  Briefcase,
  Building2,
  Calendar,
  Globe,
  MessageSquare,
  Tag,
  User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { WaitlistEntry } from '@/types/waitlist-admin';

interface EntryDetailDialogProps {
  entry: WaitlistEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    invited: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  };

  return (
    <Badge className={`${styles[status as keyof typeof styles]} border`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export function EntryDetailDialog({
  entry,
  isOpen,
  onClose,
}: EntryDetailDialogProps) {
  if (!entry) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border border-gray-200 shadow-lg max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle
                className="text-2xl font-bold text-gray-900 mb-1"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                {entry.firstName} {entry.lastName}
              </DialogTitle>
              <p className="text-sm text-gray-600">{entry.email}</p>
            </div>
            <StatusBadge status={entry.status} />
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Basic Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">User Type</p>
                  <p className="text-sm font-medium text-gray-900">
                    {entry.userType}
                  </p>
                </div>
              </div>
              {entry.organization && (
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Organization</p>
                    <p className="text-sm font-medium text-gray-900">
                      {entry.organization}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Use Case */}
          {entry.useCase && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Use Case
                </h3>
              </div>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                {entry.useCase}
              </p>
            </div>
          )}

          {/* Referral Source */}
          {entry.referralSource && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Referral Source
                </h3>
              </div>
              <p className="text-sm text-gray-700">{entry.referralSource}</p>
            </div>
          )}

          {/* Admin Notes */}
          {entry.notes && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Admin Notes
                </h3>
              </div>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                {entry.notes}
              </p>
            </div>
          )}

          {/* Priority */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Priority
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all"
                  style={{ width: `${entry.priority}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {entry.priority}
              </span>
            </div>
          </div>

          {/* Approval Information */}
          {entry.status === 'approved' && entry.approvedAt && (
            <div className="space-y-2 bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">
                Approval Information
              </h3>
              <div className="space-y-1">
                <p className="text-sm text-emerald-700">
                  <strong>Approved on:</strong>{' '}
                  {format(new Date(entry.approvedAt), 'PPpp')}
                </p>
                {entry.approvedBy && (
                  <p className="text-sm text-emerald-700">
                    <strong>Approved by:</strong> {entry.approvedBy.firstName}{' '}
                    {entry.approvedBy.lastName}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Metadata
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="font-medium text-gray-900">
                  {format(new Date(entry.createdAt), 'PPpp')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Last Updated</p>
                <p className="font-medium text-gray-900">
                  {format(new Date(entry.updatedAt), 'PPpp')}
                </p>
              </div>
              {entry.metadata?.ipAddress && (
                <div>
                  <p className="text-xs text-gray-500">IP Address</p>
                  <p className="font-medium text-gray-900 font-mono text-xs">
                    {entry.metadata.ipAddress}
                  </p>
                </div>
              )}
              {entry.metadata?.signupSource && (
                <div>
                  <p className="text-xs text-gray-500">Signup Source</p>
                  <p className="font-medium text-gray-900">
                    {entry.metadata.signupSource}
                  </p>
                </div>
              )}
            </div>
            {entry.metadata?.userAgent && (
              <div>
                <p className="text-xs text-gray-500 mb-1">User Agent</p>
                <p className="font-medium text-gray-700 font-mono text-xs bg-gray-50 p-2 rounded border border-gray-200 break-all">
                  {entry.metadata.userAgent}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button
            onClick={onClose}
            className="rounded-xl bg-gray-900 hover:bg-gray-800 text-white"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
