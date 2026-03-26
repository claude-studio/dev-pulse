import { useTheme } from '@shared/hooks/use-theme';
import { type ReportMeta } from '@shared/types';

interface HeaderProps {
  meta: ReportMeta;
}

export function Header({ meta }: HeaderProps) {
  const { theme, toggle } = useTheme();

  return (
    <header className="border-b border-border px-12 max-md:px-6 grid grid-cols-[1fr_auto_1fr] max-md:grid-cols-1 items-center gap-6 animate-fade-down">
      <div className="font-mono text-[10px] text-muted tracking-[0.15em] uppercase max-md:hidden">
        <div>{meta.volume}</div>
        <div className="mt-1">{meta.topic}</div>
      </div>

      <div className="text-center py-8 max-md:py-6 relative">
        <h1 className="font-display text-[clamp(64px,10vw,120px)] tracking-[0.05em] leading-[0.9] text-text">
          DEV<span className="text-accent">PULSE</span>
        </h1>
        {/* 모바일 전용 토글 */}
        <button
          onClick={toggle}
          aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
          className="md:hidden mt-4 border border-border px-3 py-1.5 font-mono text-[9px] text-muted tracking-[0.15em] uppercase hover:border-accent hover:text-accent cursor-pointer"
        >
          {theme === 'dark' ? '◐ LIGHT' : '◑ DARK'}
        </button>
      </div>

      <div className="font-mono text-[10px] text-muted tracking-[0.15em] uppercase text-right max-md:hidden">
        <div>{meta.date}</div>
        <div className="mt-1">{meta.sourceCount} SOURCES MONITORED</div>
        <button
          onClick={toggle}
          aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
          className="mt-3 border border-border px-2 py-1 text-[9px] tracking-[0.15em] hover:border-accent hover:text-accent cursor-pointer"
        >
          {theme === 'dark' ? '◐ LIGHT' : '◑ DARK'}
        </button>
      </div>
    </header>
  );
}
