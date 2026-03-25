interface DateDividerProps {
  label: string;
}

export function DateDivider({ label }: DateDividerProps) {
  return (
    <div className="flex items-center gap-4 py-10 pb-6 animate-fade-up [animation-delay:0.2s]">
      <span className="font-mono text-[10px] text-muted tracking-[0.2em] uppercase whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
