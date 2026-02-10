/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
'use client';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Activity, Filter, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useWaitlistSummary } from '@/hooks/useWaitlist';

export function BetaUsersDashboard() {
  const [filters, setFilters] = useState<{
    status?: 'active' | 'inactive' | 'suspended';
    dateFrom?: string;
    dateTo?: string;
  }>({});

  const { data, isLoading, error } = useWaitlistSummary(filters);

  // Compute summary statistics from the data
  const summary = data?.data
    ? {
        totalUsers: data.count,
        activeUsers: data.data.filter(
          (u) => u.totalMediaUploads > 0 || u.totalAnalyses > 0,
        ).length,
        averageEngagementScore:
          data.count > 0
            ? data.data.reduce((sum, u) => sum + u.engagementScore, 0) /
              data.count
            : 0,
      }
    : { totalUsers: 0, activeUsers: 0, averageEngagementScore: 0 };

  if (error) {
    return (
      <div className="p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <Activity className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Data
          </h3>
          <p className="text-gray-600 text-sm">
            Failed to load beta user activity. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Beta Users Activity
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor engagement and activity of beta users
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <Select
            value={filters.status || 'all'}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                status:
                  value === 'all'
                    ? undefined
                    : (value as 'active' | 'inactive' | 'suspended'),
              }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Account Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

          {filters.status && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({})}
              className="text-sm"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={`loading-${i}`}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-24 mb-4" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-blue-700 mb-1">
              Total Users
            </p>
            <p
              className="text-3xl font-bold text-blue-900"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              {summary.totalUsers}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-emerald-700 mb-1">
              Active Users
            </p>
            <p
              className="text-3xl font-bold text-emerald-900"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              {summary.activeUsers}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-purple-700 mb-1">
              Avg Engagement
            </p>
            <p
              className="text-3xl font-bold text-purple-900"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              {summary.averageEngagementScore.toFixed(1)}%
            </p>
          </motion.div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="flex items-center gap-4 animate-pulse"
              >
                <div className="h-12 bg-gray-100 rounded flex-1" />
                <div className="h-12 bg-gray-100 rounded w-32" />
                <div className="h-12 bg-gray-100 rounded w-24" />
              </div>
            ))}
          </div>
        ) : !data || !data.data || data.data.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3
              className="text-xl font-bold mb-2 text-gray-900"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              No users found
            </h3>
            <p className="text-gray-600 text-sm">
              Try adjusting your filters or check back later.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 bg-gray-50/50 hover:bg-gray-50/50">
                  <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">
                    Email
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">
                    Name
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">
                    Signed Up
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">
                    Last Active
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">
                    Engagement
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">
                    Media
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">
                    Analyses
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((user, index) => (
                  <motion.tr
                    key={user.userId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-900 text-sm">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-gray-700 text-sm">
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {format(new Date(user.signupDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {format(new Date(user.lastActive), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                            style={{ width: `${user.engagementScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700 min-w-[3ch]">
                          {user.engagementScore}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-700 font-medium">
                      {user.totalMediaUploads}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700 font-medium">
                      {user.totalAnalyses}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
