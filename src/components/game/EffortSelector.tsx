import type { EffortLevel } from '../../types/course';

interface EffortSelectorProps {
  selected: EffortLevel | null;
  onChange: (effort: EffortLevel) => void;
  showEnergyCost?: boolean;
}

const EFFORT_OPTIONS: { value: EffortLevel; label: string; cost: number; desc: string }[] = [
  { value: 'skip', label: '逃课', cost: 0, desc: '不去上课，赌老师不点名' },
  { value: 'idle', label: '摸鱼', cost: 1, desc: '去了但刷手机' },
  { value: 'normal', label: '正常', cost: 3, desc: '该干嘛干嘛' },
  { value: 'serious', label: '认真', cost: 5, desc: '认真听课做笔记' },
  { value: 'dead', label: '死磕', cost: 7, desc: '拼尽全力卷' },
];

export function EffortSelector({ selected, onChange, showEnergyCost = true }: EffortSelectorProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {EFFORT_OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`
            py-3 px-2 rounded-lg text-center transition-all duration-200 border text-sm
            ${selected === opt.value
              ? 'bg-ink-black text-white border-ink-black shadow-md'
              : 'bg-white border-bureau-gray/20 text-ink-black hover:border-ink-black/30 hover:shadow-sm'
            }
          `}
        >
          <div className="font-bold">{opt.label}</div>
          {showEnergyCost && <div className="text-xs mt-0.5 opacity-70">{opt.cost}精力</div>}
        </button>
      ))}
    </div>
  );
}
