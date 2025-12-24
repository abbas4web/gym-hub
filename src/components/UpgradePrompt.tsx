import { Crown, Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Plan } from '@/types/subscription';

interface UpgradePromptProps {
  feature: keyof Plan['limits'];
  title: string;
  description: string;
  onUpgrade: () => void;
}

const UpgradePrompt = ({ feature, title, description, onUpgrade }: UpgradePromptProps) => {
  const { currentPlan, isUpgradeNeeded } = useSubscription();

  if (!isUpgradeNeeded(feature)) return null;

  return (
    <div className="glass-card p-6 text-center space-y-4">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
        <Lock className="h-8 w-8 text-primary" />
      </div>
      
      <div>
        <h3 className="text-lg font-bold font-heading text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Crown className="h-4 w-4" />
        <span>Available in Pro & Business plans</span>
      </div>

      <Button onClick={onUpgrade} className="w-full">
        <Zap className="h-4 w-4 mr-2" />
        Upgrade to Unlock
      </Button>

      <p className="text-xs text-muted-foreground">
        Current plan: {currentPlan.name}
      </p>
    </div>
  );
};

export default UpgradePrompt;
