interface GradeResultProps {
  gradePoint: number;
  label?: string;
  className?: string;
}

export function GradeResult({ gradePoint, label, className = '' }: GradeResultProps) {
  const colorClass =
    gradePoint >= 3.5 ? 'grade-green' :
    gradePoint >= 2.0 ? 'grade-yellow' :
    'grade-red';

  const gradeLetter =
    gradePoint >= 3.7 ? 'A' :
    gradePoint >= 3.3 ? 'B+' :
    gradePoint >= 3.0 ? 'B' :
    gradePoint >= 2.7 ? 'B-' :
    gradePoint >= 2.3 ? 'C+' :
    gradePoint >= 2.0 ? 'C' :
    gradePoint >= 1.0 ? 'D' :
    'F';

  return (
    <div className={`text-center ${className}`}>
      {label && <div className="text-xs text-bureau-gray mb-1">{label}</div>}
      <div className={`text-4xl font-extrabold ${colorClass}`}>
        {gradePoint.toFixed(2)}
      </div>
      <div className={`text-sm font-bold mt-1 ${colorClass}`}>
        {gradeLetter}
        {gradePoint >= 3.5 ? ' 👍' : gradePoint < 1.0 ? ' 💀' : ''}
      </div>
    </div>
  );
}
