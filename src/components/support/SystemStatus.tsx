'use client';

import { AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface Service {
  name: string;
  status: 'operational' | 'degraded' | 'down' | 'maintenance';
  description: string;
}

const services: Service[] = [
  {
    name: 'API Services',
    status: 'operational',
    description: 'All API endpoints responding normally',
  },
  {
    name: 'Media Processing',
    status: 'operational',
    description: 'Verification and analysis running smoothly',
  },
  {
    name: 'Authentication',
    status: 'operational',
    description: 'Login and registration services active',
  },
  {
    name: 'File Storage',
    status: 'operational',
    description: 'Upload and download services available',
  },
];

function StatusIndicator({ status }: { status: Service['status'] }) {
  const config = {
    operational: {
      icon: CheckCircle2,
      color: '#10b981',
      bg: '#d1fae5',
      label: 'Operational',
    },
    degraded: {
      icon: AlertCircle,
      color: '#f59e0b',
      bg: '#fef3c7',
      label: 'Degraded',
    },
    down: {
      icon: XCircle,
      color: '#ef4444',
      bg: '#fee2e2',
      label: 'Down',
    },
    maintenance: {
      icon: Clock,
      color: '#6366f1',
      bg: '#e0e7ff',
      label: 'Maintenance',
    },
  };

  const { icon: Icon, color, bg, label } = config[status];

  return (
    <div className="flex items-center gap-2">
      <div className="p-1 rounded-full" style={{ backgroundColor: bg }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <span className="text-sm font-medium" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

export function SystemStatus() {
  const allOperational = services.every((s) => s.status === 'operational');

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3
          className="text-xl font-bold text-gray-900"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          System Status
        </h3>
        {allOperational && (
          <div className="flex items-center gap-2 text-emerald-600">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold">
              All Systems Operational
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.name}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
          >
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">
                {service.name}
              </h4>
              <p className="text-sm text-gray-600">{service.description}</p>
            </div>
            <StatusIndicator status={service.status} />
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Last updated: {new Date().toLocaleTimeString()} •{' '}
          <button
            type="button"
            onClick={() => window.open('/status', '_blank')}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View full status page
          </button>
        </p>
      </div>
    </div>
  );
}
