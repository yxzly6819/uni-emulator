interface ProgressBarProps {
  value: number;       // 0-100
  max?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export function ProgressBar({ value, max = 100, label, showValue = true, className = '' }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  const barColor =
    pct >= 60 ? 'bg-health-green' :
    pct >= 30 ? 'bg-party-gold' :
    'bg-danger-red';

  const textColor =
    pct >= 60 ? 'text-health-green' :
    pct >= 30 ? 'text-party-gold' :
    'text-danger-red';

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between text-sm mb-1">
          {label && <span className="text-bureau-gray">{label}</span>}
          {showValue && <span className={`font-bold ${textColor}`}>{Math.round(pct)}</span>}
        </div>
      )}
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
