interface BgNumProps {
  value: string;
}

export function BgNum({ value }: BgNumProps) {
  return <div className="bg-num">{value}</div>;
}
