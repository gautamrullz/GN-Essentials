import Link from "next/link";

import { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { cn } from "@/lib/utils";

type MetricCardVariant =
  | "hero"
  | "warning"
  | "danger"
  | "default";

interface MetricCardProps {
  title: string;
  value: string | number;
  href: string;
  icon: LucideIcon;
  variant?: MetricCardVariant;
}

const variantStyles: Record<
  MetricCardVariant,
  {
    card: string;
    icon: string;
  }
> = {
  hero: {
    card:
      "border border-emerald-200 bg-emerald-50 hover:bg-emerald-100",
    icon: "text-emerald-600",
  },

  warning: {
    card:
      "border border-amber-200 bg-amber-50 hover:bg-amber-100",
    icon: "text-amber-600",
  },

  danger: {
    card:
      "border border-red-200 bg-red-50 hover:bg-red-100",
    icon: "text-red-600",
  },

  default: {
    card: "hover:bg-muted/50",
    icon: "text-muted-foreground",
  },
};

export function MetricCard({
  title,
  value,
  href,
  icon: Icon,
  variant = "default",
}: MetricCardProps) {
  const styles = variantStyles[variant];

  return (
    <Link href={href}>
      <Card
        className={cn(
          "h-full cursor-pointer transition-all hover:shadow-md",
          styles.card,
        )}
      >
        <CardContent>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {title}
              </p>

              <p className="mt-2 text-2xl font-bold md:text-3xl">
                {value}
              </p>
            </div>

            <Icon
              className={cn(
                "h-8 w-8 shrink-0",
                styles.icon,
              )}
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}