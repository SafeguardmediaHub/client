import type { VerificationScores } from '@/types/batch';

interface VerificationScoresProps {
  scores: VerificationScores;
  compact?: boolean;
}

export function VerificationScoresComponent({
  scores,
  compact = false,
}: VerificationScoresProps) {
  if (!scores) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 0.8) return 'text-green-700';
    if (score >= 0.5) return 'text-yellow-700';
    return 'text-red-700';
  };

  if (compact && scores.overall !== undefined) {
    const overallScore = scores.overall;
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${getScoreColor(overallScore)}`}
            style={{ width: `${overallScore * 100}%` }}
          />
        </div>
        <span
          className={`text-xs font-medium ${getScoreTextColor(overallScore)}`}
        >
          {(overallScore * 100).toFixed(0)}%
        </span>
      </div>
    );
  }

  const scoreEntries = Object.entries(scores).filter(
    ([_, value]) => value !== undefined
  );

  if (scoreEntries.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {scoreEntries.map(([key, value]) => {
        const score = value as number;
        const label =
          key === 'overall'
            ? 'Overall'
            : key.charAt(0).toUpperCase() + key.slice(1);

        return (
          <div key={key} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-700 font-medium">{label}</span>
              <span className={getScoreTextColor(score)}>
                {(score * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${getScoreColor(score)}`}
                style={{ width: `${score * 100}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
