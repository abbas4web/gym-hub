import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  delay?: number;
}

const StatCard = ({ title, value, icon: Icon, trend, delay = 0 }: StatCardProps) => {
  return (
    <div 
      className="glass-card p-5 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold font-heading mt-1 text-foreground">{value}</p>
          {trend && (
            <p className="text-primary text-xs mt-2 font-medium">{trend}</p>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-xl">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
