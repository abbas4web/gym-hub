import { AlertTriangle, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Progress } from '@/components/ui/progress';

interface ClientLimitBannerProps {
  currentClientCount: number;
  onUpgrade: () => void;
}

const ClientLimitBanner = ({ currentClientCount, onUpgrade }: ClientLimitBannerProps) => {
  const { currentPlan, canAddClient } = useSubscription();
  
  const maxClients = currentPlan.limits.maxClients;
  const isUnlimited = maxClients === Infinity;
  const percentage = isUnlimited ? 0 : Math.min((currentClientCount / maxClients) * 100, 100);
  const isNearLimit = !isUnlimited && percentage >= 80;
  const isAtLimit = !canAddClient(currentClientCount);

  if (isUnlimited || percentage < 60) return null;

  return (
    <div className={`glass-card p-4 space-y-3 ${isAtLimit ? 'border-destructive/50' : 'border-amber-500/30'}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg shrink-0 ${isAtLimit ? 'bg-destructive/20' : 'bg-amber-500/20'}`}>
          <AlertTriangle className={`h-4 w-4 ${isAtLimit ? 'text-destructive' : 'text-amber-500'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-medium ${isAtLimit ? 'text-destructive' : 'text-amber-400'}`}>
            {isAtLimit ? 'Client Limit Reached!' : 'Approaching Client Limit'}
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isAtLimit 
              ? 'Upgrade your plan to add more clients.'
              : `You've used ${currentClientCount} of ${maxClients} clients.`
            }
          </p>
        </div>
      </div>
      
      <Progress value={percentage} className="h-2" />
      
      <Button 
        size="sm" 
        variant={isAtLimit ? 'default' : 'outline'}
        onClick={onUpgrade}
        className="w-full"
      >
        <Crown className="h-4 w-4 mr-2" />
        Upgrade for Unlimited
      </Button>
    </div>
  );
};

export default ClientLimitBanner;
