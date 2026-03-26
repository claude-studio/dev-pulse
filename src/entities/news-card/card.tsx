import { type NewsItem } from '@shared/types';
import { BgNum, Bullets, CardLink, Tag, Version } from '@shared/ui';

interface CardProps {
  item: NewsItem;
}

const variantClasses: Record<NewsItem['variant'], string> = {
  hero: 'col-span-12 md:col-span-8 md:row-span-2 !p-7 md:!p-10',
  tall: 'col-span-12 md:col-span-4 md:row-span-2',
  wide: 'col-span-12 md:col-span-6',
  sm: 'col-span-12 md:col-span-6 lg:col-span-4',
  third: 'col-span-12 md:col-span-6 lg:col-span-4',
};

export function Card({ item }: CardProps) {
  const { category, variant, tag, version, title, date, source, bullets, link, bgNum } = item;
  const isHero = variant === 'hero';

  return (
    <div
      className={`relative overflow-hidden bg-surface p-7 hover:bg-surface-hover animate-fade-up card-stagger card-accent card-accent-${category} ${isHero ? 'card-hero-scanline' : ''} ${variantClasses[variant]}`}
    >
      <Tag category={category} label={tag} />
      {version && <Version text={version} category={category} hero={isHero} />}
      <h2
        className={`font-body font-bold leading-[1.3] mb-3 tracking-[-0.01em] ${isHero ? 'text-[clamp(22px,2.5vw,32px)]' : 'text-[18px]'}`}
      >
        {title}
      </h2>
      <div className="font-mono text-[9px] text-muted tracking-[0.15em] mb-4 uppercase">
        {date} · {source}
      </div>
      <Bullets items={bullets} large={isHero} />
      <CardLink url={link.url} label={link.label} />
      {bgNum && <BgNum value={bgNum} />}
    </div>
  );
}
