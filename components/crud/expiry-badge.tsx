import { Badge } from "@/components/ui/badge";

interface ExpiryBadgeProps {
  expiryDate: string | null;
}

export function ExpiryBadge({
  expiryDate,
}: ExpiryBadgeProps) {
  if (!expiryDate) {
    return (
      <Badge variant="secondary">
        No Expiry
      </Badge>
    );
  }

  const today = new Date();

  const expiry = new Date(expiryDate);

  const diffDays = Math.ceil(
    (expiry.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (diffDays < 0) {
    return (
      <Badge variant="destructive">
        Expired
      </Badge>
    );
  }

  if (diffDays <= 30) {
    return (
      <Badge
        variant="outline"
        className="border-yellow-500 text-yellow-600"
      >
        {diffDays} Days Left
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="border-green-500 text-green-600"
    >
      Safe
    </Badge>
  );
}