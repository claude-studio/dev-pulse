import { type Category } from '@shared/types';

interface VersionProps {
  text: string;
  category: Category;
  hero?: boolean;
}

const categoryColor: Record<Category, string> = {
  tool: 'text-accent',
  release: 'text-accent3',
  infra: 'text-infra',
  ai: 'text-ai',
  security: 'text-accent2',
};

export function Version({ text, category, hero = false }: VersionProps) {
  return (
    <div
      className={`font-display leading-none mb-3 tracking-[0.02em] ${hero ? 'text-[clamp(60px,8vw,120px)]' : 'text-[clamp(36px,5vw,72px)]'} ${categoryColor[category]}`}
    >
      {text}
    </div>
  );
}
