import { Waves } from 'lucide-react';

interface BrandMarkProps {
  compact?: boolean;
  inverse?: boolean;
}

export const BrandMark = ({ compact = false, inverse = false }: BrandMarkProps) => (
  <span className={`inline-flex items-center gap-2.5 ${inverse ? 'text-white' : 'text-[#172033]'}`}>
    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${inverse ? 'bg-[#0d6efd] text-[#ffdc45]' : 'bg-[#172033] text-white'}`}>
      <Waves size={18} strokeWidth={2.4} aria-hidden="true" />
    </span>
    {!compact && (
      <span className="font-display text-xl font-extrabold">
        Board<span className={inverse ? 'text-[#ffdc45]' : 'text-[#1957d2]'}>Wave</span>
      </span>
    )}
  </span>
);
