interface EmptyStateProps {
  title: string;
}

export function EmptyState({ title }: EmptyStateProps) {
  return <div className="py-10 text-center text-muted-foreground">{title}</div>;
}
