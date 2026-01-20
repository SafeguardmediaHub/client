/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */

'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  Mail,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react';
import { useWaitlistStats } from '@/hooks/useWaitlist';

interface StatCardProps {
  title: string;
  value: number | undefined;
  icon: React.ReactNode;
  color: string;
  delay?: number;
}

function StatCard({ title, value, icon, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="p-3 rounded-xl"
          style={{ backgroundColor: `${color}15` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </p>
        <motion.p
          className="text-3xl font-bold text-gray-900"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          {value !== undefined ? value.toLocaleString() : '—'}
        </motion.p>
      </div>
    </motion.div>
  );
}

export function WaitlistStats() {
  const { data: stats, isLoading } = useWaitlistStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-pulse"
          >
            <div className="h-12 w-12 bg-gray-100 rounded-xl mb-4" />
            <div className="h-3 bg-gray-100 rounded w-24 mb-3" />
            <div className="h-8 bg-gray-100 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Signups"
          value={stats?.total}
          icon={<Users className="w-5 h-5" />}
          color="#6366f1"
          delay={0}
        />
        <StatCard
          title="Pending"
          value={stats?.byStatus.pending}
          icon={<Clock className="w-5 h-5" />}
          color="#f59e0b"
          delay={0.1}
        />
        <StatCard
          title="Approved"
          value={stats?.byStatus.approved}
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="#10b981"
          delay={0.2}
        />
        <StatCard
          title="This Week"
          value={stats?.recentSignups.thisWeek}
          icon={<TrendingUp className="w-5 h-5" />}
          color="#8b5cf6"
          delay={0.3}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Rejected"
          value={stats?.byStatus.rejected}
          icon={<XCircle className="w-5 h-5" />}
          color="#ef4444"
          delay={0.4}
        />
        <StatCard
          title="Invited"
          value={stats?.byStatus.invited}
          icon={<Mail className="w-5 h-5" />}
          color="#06b6d4"
          delay={0.5}
        />
        <StatCard
          title="Today"
          value={stats?.recentSignups.today}
          icon={<TrendingUp className="w-5 h-5" />}
          color="#10b981"
          delay={0.6}
        />
      </div>
    </div>
  );
}
