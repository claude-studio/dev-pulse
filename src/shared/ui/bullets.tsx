interface BulletsProps {
  items: string[];
  large?: boolean;
}

export function Bullets({ items, large = false }: BulletsProps) {
  return (
    <ul className="list-none flex flex-col gap-2">
      {items.map((item, i) => (
        <li
          key={i}
          className={`relative pl-4 leading-[1.5] text-muted ${large ? 'text-sm' : 'text-[13px]'}`}
        >
          <span className="absolute left-0 text-[11px] text-muted">→</span>
          <span dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  );
}
