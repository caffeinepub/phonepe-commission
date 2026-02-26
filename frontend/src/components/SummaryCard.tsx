import { Card, CardContent } from '@/components/ui/card';
import { type LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  gradient?: string;
}

export default function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-primary',
  gradient,
}: SummaryCardProps) {
  return (
    <Card className="relative overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-200 border-border/60">
      {gradient && (
        <div className={`absolute inset-0 opacity-5 ${gradient}`} />
      )}
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              {title}
            </p>
            <p className="text-3xl font-extrabold text-foreground tracking-tight truncate">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1.5 font-medium">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-secondary flex-shrink-0 ml-4 ${iconColor}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
