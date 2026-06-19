import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MetricCardSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-3 p-6">
        <Skeleton className="h-1 w-24" />

        <Skeleton className="h-1 w-32" />

        <Skeleton className="h-1 w-16" />
      </CardContent>
    </Card>
  );
}