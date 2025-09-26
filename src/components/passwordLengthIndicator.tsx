'use client';

const getPasswordStrength = (
  password: string
): {
  score: number;
  label: string;
  color: string;
} => {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 4) return { score, label: 'Medium', color: 'bg-amber-500' };
  return { score, label: 'Strong', color: 'bg-green-500' };
};

interface PasswordStrengthIndicatorProps {
  password: string;
  show: boolean;
}

export function PasswordStrengthIndicator({
  password,
  show,
}: PasswordStrengthIndicatorProps) {
  if (!show || !password) return null;

  const { score, label, color } = getPasswordStrength(password);
  const percentage = (score / 6) * 100;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-600">Password strength</span>
        <span
          className={`text-xs font-medium ${
            label === 'Weak'
              ? 'text-red-600'
              : label === 'Medium'
              ? 'text-amber-600'
              : 'text-green-600'
          }`}
        >
          {label}
        </span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-slate-500 space-y-1">
        <div className="grid grid-cols-2 gap-2">
          <div
            className={`flex items-center space-x-1 ${
              password.length >= 8 ? 'text-green-600' : 'text-slate-400'
            }`}
          >
            <div
              className={`w-1 h-1 rounded-full ${
                password.length >= 8 ? 'bg-green-600' : 'bg-slate-400'
              }`}
            />
            <span>8+ characters</span>
          </div>
          <div
            className={`flex items-center space-x-1 ${
              /[A-Z]/.test(password) ? 'text-green-600' : 'text-slate-400'
            }`}
          >
            <div
              className={`w-1 h-1 rounded-full ${
                /[A-Z]/.test(password) ? 'bg-green-600' : 'bg-slate-400'
              }`}
            />
            <span>Uppercase</span>
          </div>
          <div
            className={`flex items-center space-x-1 ${
              /[0-9]/.test(password) ? 'text-green-600' : 'text-slate-400'
            }`}
          >
            <div
              className={`w-1 h-1 rounded-full ${
                /[0-9]/.test(password) ? 'bg-green-600' : 'bg-slate-400'
              }`}
            />
            <span>Number</span>
          </div>
          <div
            className={`flex items-center space-x-1 ${
              /[^A-Za-z0-9]/.test(password)
                ? 'text-green-600'
                : 'text-slate-400'
            }`}
          >
            <div
              className={`w-1 h-1 rounded-full ${
                /[^A-Za-z0-9]/.test(password) ? 'bg-green-600' : 'bg-slate-400'
              }`}
            />
            <span>Special char</span>
          </div>
        </div>
      </div>
    </div>
  );
}
