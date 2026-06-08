import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    // <Badge variant={status === "ACTIVE" ? "default" : "secondary"}>
    //   {status}
    // </Badge>
    <Badge variant="outline">
      <div
        className={`h-2 w-2 rounded-full ${status === "ACTIVE" ? "bg-green-500" : "bg-red-500"}`}
      />
    </Badge>
  );
}
