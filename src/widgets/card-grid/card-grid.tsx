import { type NewsItem, type VercelNewsItem } from '@shared/types';

import { Card, VercelCard } from '@entities/news-card';

interface CardGridProps {
  items: (NewsItem | VercelNewsItem)[];
}

function isVercelItem(item: NewsItem | VercelNewsItem): item is VercelNewsItem {
  return (item as VercelNewsItem).type === 'vercel';
}

export function CardGrid({ items }: CardGridProps) {
  return (
    <div className="grid grid-cols-12 gap-px bg-border border border-border">
      {items.map((item) =>
        isVercelItem(item) ? (
          <VercelCard key={item.id} item={item} />
        ) : (
          <Card key={item.id} item={item} />
        ),
      )}
    </div>
  );
}
