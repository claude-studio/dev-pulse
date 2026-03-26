import { type ReportMeta } from '@shared/types';

interface FooterProps {
  meta: ReportMeta;
}

export function Footer({ meta }: FooterProps) {
  return (
    <footer className="border-t border-border px-12 py-6 flex justify-between items-center max-md:px-6 max-md:flex-col max-md:gap-3 max-md:text-center">
      <div className="font-display text-2xl tracking-[0.05em] text-muted">
        DEV<span className="text-accent">PULSE</span>
      </div>
      <div className="font-mono text-[10px] text-muted tracking-[0.1em] text-right leading-[1.8] max-md:text-center">
        <div>GENERATED {meta.date.split(' ')[0]}</div>
        <div>
          {meta.sourceCount} SOURCES · {meta.topic}
        </div>
        <div className="text-muted mt-1">Powered by Claude Code</div>
        <div className="mt-1">
          <a
            href="https://github.com/claude-studio/dev-pulse"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-accent transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
