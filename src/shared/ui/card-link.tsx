interface CardLinkProps {
  url: string;
  label: string;
}

export function CardLink({ url, label }: CardLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="card-link inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] uppercase text-muted no-underline mt-5 transition-colors duration-200 border-b border-transparent pb-0.5 hover:text-text hover:border-current"
    >
      {label}
    </a>
  );
}
