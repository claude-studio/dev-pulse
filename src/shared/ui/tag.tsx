import { type Category } from '@shared/types';

interface TagProps {
  category: Category;
  label: string;
}

const categoryStyles: Record<Category, string> = {
  tool: 'text-accent border-accent',
  release: 'text-accent3 border-accent3',
  infra: 'text-infra border-infra',
  ai: 'text-ai border-ai',
  security: 'text-accent2 border-accent2',
};

export function Tag({ category, label }: TagProps) {
  return (
    <span
      className={`inline-block font-mono text-[9px] tracking-[0.2em] uppercase px-[10px] py-1 border rounded-[2px] mb-4 ${categoryStyles[category]}`}
    >
      [{label}]
    </span>
  );
}
