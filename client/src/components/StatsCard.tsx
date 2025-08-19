import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  value: string | number;
  subtitle: string;
  trend?: string;
  trendColor?: string;
  badge?: number;
}

export default function StatsCard({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  value,
  subtitle,
  trend,
  trendColor,
  badge
}: StatsCardProps) {
  return (
    <Card className="shadow-soft border-gray-100 hover:shadow-medium transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          {trend && (
            <span className={`text-sm font-medium ${trendColor}`}>
              {trend}
            </span>
          )}
          {badge !== undefined && (
            <span className="text-sm text-sage font-medium">
              {badge}
            </span>
          )}
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="text-sm text-gray-600">{title}</div>
        <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
      </CardContent>
    </Card>
  );
}
