interface TickerProps {
  items: string[];
}

export function Ticker({ items }: TickerProps) {
  // 무한 루프를 위해 아이템 2배 복제
  const doubled = [...items, ...items];

  return (
    <div className="bg-accent text-bg overflow-hidden whitespace-nowrap py-2.5 border-t border-border border-b-[3px] border-b-bg">
      <div className="ticker-animate inline-flex gap-0">
        {doubled.map((item, i) => (
          <span key={i} className="font-mono text-[11px] font-bold tracking-[0.1em] px-12">
            {item} <span className="text-black/30">///</span>
          </span>
        ))}
      </div>
    </div>
  );
}
