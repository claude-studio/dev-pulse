import { type VercelNewsItem } from '@shared/types';
import { CardLink, Tag } from '@shared/ui';

interface VercelCardProps {
  item: VercelNewsItem;
}

export function VercelCard({ item }: VercelCardProps) {
  const { tag, title, date, items, link } = item;

  return (
    <div className="relative overflow-hidden bg-surface p-7 col-span-12 md:col-span-6 lg:col-span-4 transition-colors duration-200 hover:bg-surface-hover animate-fade-up card-stagger card-accent card-accent-infra">
      <Tag category="infra" label={tag} />
      <h2 className="font-body font-bold text-[16px] leading-[1.3] mb-5 tracking-[-0.01em]">
        {title}
      </h2>
      <div className="font-mono text-[9px] text-muted tracking-[0.15em] mb-4 uppercase">{date}</div>
      <div className="flex flex-col gap-4 mt-2">
        {items.map((it, i) => (
          <div key={i} className="border-l-2 border-infra pl-3.5">
            <div className="text-[13px] font-medium mb-1">{it.title}</div>
            <div className="text-[12px] text-muted leading-[1.5]">{it.description}</div>
          </div>
        ))}
      </div>
      <CardLink url={link.url} label={link.label} />
    </div>
  );
}
