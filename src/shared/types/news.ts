export type Category = 'tool' | 'release' | 'infra' | 'ai' | 'security';
export type CardVariant = 'hero' | 'tall' | 'wide' | 'sm' | 'third';

export interface NewsItem {
  id: string;
  category: Category;
  variant: CardVariant;
  tag: string;
  version?: string;
  title: string;
  date: string;
  source: string;
  bullets: string[];
  link: { url: string; label: string };
  bgNum?: string;
}

export interface VercelItem {
  title: string;
  description: string;
}

export interface VercelNewsItem {
  id: string;
  category: 'infra';
  variant: 'third';
  tag: string;
  title: string;
  date: string;
  type: 'vercel';
  items: VercelItem[];
  link: { url: string; label: string };
}

export interface DateSection {
  label: string;
  date: string;
  news: (NewsItem | VercelNewsItem)[];
}

export interface ReportMeta {
  volume: string;
  topic: string;
  date: string;
  sourceCount: number;
}

export interface NewsletterData {
  meta: ReportMeta;
  ticker: string[];
  sections: DateSection[];
}
