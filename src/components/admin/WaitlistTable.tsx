/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
'use client';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { CheckCircle2, Eye, Trash2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { WaitlistEntry, WaitlistStatus } from '@/types/waitlist-admin';

interface WaitlistTableProps {
  entries: WaitlistEntry[];
  isLoading: boolean;
  onViewEntry: (entry: WaitlistEntry) => void;
  onApprove: (entry: WaitlistEntry) => void;
  onReject: (entry: WaitlistEntry) => void;
  onDelete: (entry: WaitlistEntry) => void;
}

function StatusBadge({ status }: { status: WaitlistStatus }) {
  const styles = {
    pending: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      label: 'Pending',
    },
    approved: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      label: 'Approved',
    },
    rejected: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      label: 'Rejected',
    },
    invited: {
      bg: 'bg-cyan-50',
      text: 'text-cyan-700',
      border: 'border-cyan-200',
      label: 'Invited',
    },
  };

  const style = styles[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-semibold ${style.bg} ${style.text} ${style.border}`}
    >
      {style.label}
    </span>
  );
}

export function WaitlistTable({
  entries,
  isLoading,
  onViewEntry,
  onApprove,
  onReject,
  onDelete,
}: WaitlistTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-8 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="h-12 bg-gray-100 rounded flex-1" />
              <div className="h-12 bg-gray-100 rounded w-32" />
              <div className="h-12 bg-gray-100 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <Eye className="w-10 h-10 text-gray-400" />
          </div>
          <h3
            className="text-xl font-bold mb-2 text-gray-900"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            No entries found
          </h3>
          <p className="text-gray-600 text-sm">
            Try adjusting your filters or search criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50/50 hover:bg-gray-50/50">
              <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">
                Name
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">
                Email
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">
                User Type
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">
                Organization
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">
                Created
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, index) => (
              <motion.tr
                key={entry._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
              >
                <TableCell className="font-medium text-gray-900">
                  {entry.firstName} {entry.lastName}
                </TableCell>
                <TableCell className="text-gray-600 text-sm">
                  {entry.email}
                </TableCell>
                <TableCell className="text-sm text-gray-700">
                  {entry.userType}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {entry.organization || '—'}
                </TableCell>
                <TableCell>
                  <StatusBadge status={entry.status} />
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {format(new Date(entry.createdAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewEntry(entry)}
                      className="border-gray-300 rounded-lg hover:bg-gray-50 h-8 w-8 p-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {entry.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => onApprove(entry)}
                          className="rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white h-8 w-8 p-0"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => onReject(entry)}
                          className="rounded-lg bg-red-500 hover:bg-red-600 text-white h-8 w-8 p-0"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(entry)}
                      className="border-gray-300 rounded-lg hover:bg-red-50 h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
