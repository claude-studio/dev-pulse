import newsletterData from '@shared/data/newsletter.json';
import { type NewsletterData } from '@shared/types';

import { DateDivider } from '@entities/date-divider';

import { CardGrid } from '@widgets/card-grid';
import { Footer } from '@widgets/footer';
import { Header } from '@widgets/header';
import { Ticker } from '@widgets/ticker';

const data = newsletterData as NewsletterData;

export function ReportPage() {
  return (
    <>
      <Header meta={data.meta} />
      <Ticker items={data.ticker} />
      <main className="max-w-[1400px] mx-auto px-12 pb-20 max-md:px-6 max-md:pb-12">
        {data.sections.map((section, i) => (
          <div key={i}>
            <DateDivider label={`${section.label} — ${section.date}`} />
            <CardGrid items={section.news} />
          </div>
        ))}
      </main>
      <Footer meta={data.meta} />
    </>
  );
}
