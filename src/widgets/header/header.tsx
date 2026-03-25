import { type ReportMeta } from '@shared/types';

interface HeaderProps {
  meta: ReportMeta;
}

export function Header({ meta }: HeaderProps) {
  return (
    <header className="border-b border-border px-12 max-md:px-6 grid grid-cols-[1fr_auto_1fr] max-md:grid-cols-1 items-center gap-6 animate-fade-down">
      <div className="font-mono text-[10px] text-muted tracking-[0.15em] uppercase max-md:hidden">
        <div>{meta.volume}</div>
        <div className="mt-1">{meta.topic}</div>
      </div>

      <div className="text-center py-8 border-l border-r border-border max-md:border-l-0 max-md:border-r-0 max-md:py-6">
        <div className="font-mono text-[9px] text-accent tracking-[0.4em] uppercase mb-2">
          📡 Daily Digest
        </div>
        <h1 className="font-display text-[clamp(64px,10vw,120px)] tracking-[0.05em] leading-[0.9] text-text">
          DEV<span className="text-accent">PULSE</span>
        </h1>
      </div>

      <div className="font-mono text-[10px] text-muted tracking-[0.15em] uppercase text-right max-md:hidden">
        <div>{meta.date}</div>
        <div className="mt-1">{meta.sourceCount} SOURCES MONITORED</div>
      </div>
    </header>
  );
}
