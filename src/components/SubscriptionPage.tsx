import { useState } from 'react';
import { ArrowLeft, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { PLANS, BillingCycle, PlanType } from '@/types/subscription';
import PricingCard from './PricingCard';
import PaymentModal from './PaymentModal';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionPageProps {
  onBack: () => void;
}

const SubscriptionPage = ({ onBack }: SubscriptionPageProps) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const { subscription, currentPlan, updateSubscription } = useSubscription();
  const { toast } = useToast();

  const handleSelectPlan = (planId: PlanType) => {
    if (planId === subscription.planId) return;
    
    if (planId === 'free') {
      updateSubscription('free', 'monthly');
      toast({
        title: "Plan Changed",
        description: "You've switched to the Free plan.",
      });
    } else {
      setSelectedPlan(planId);
    }
  };

  const handlePaymentSuccess = () => {
    if (selectedPlan) {
      updateSubscription(selectedPlan, billingCycle);
      toast({
        title: "Subscription Activated!",
        description: `You're now on the ${PLANS.find(p => p.id === selectedPlan)?.name} plan.`,
      });
      setSelectedPlan(null);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 animate-fade-in">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground flex items-center gap-2">
            <Crown className="h-6 w-6 text-primary" />
            Subscription
          </h1>
          <p className="text-muted-foreground text-sm">Choose the plan that's right for you</p>
        </div>
      </div>

      {/* Current Plan Status */}
      <div className="glass-card p-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-xl">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Current Plan: {currentPlan.name}</p>
              <p className="text-sm text-muted-foreground">
                {subscription.status === 'active' 
                  ? `Renews on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                  : 'Free forever'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center animate-slide-up" style={{ animationDelay: '150ms' }}>
        <Tabs value={billingCycle} onValueChange={(v) => setBillingCycle(v as BillingCycle)}>
          <TabsList className="bg-secondary">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly" className="relative">
              Yearly
              <span className="absolute -top-2 -right-2 text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                -17%
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
        {PLANS.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            billingCycle={billingCycle}
            isCurrentPlan={plan.id === subscription.planId}
            onSelect={() => handleSelectPlan(plan.id)}
          />
        ))}
      </div>

      {/* Features Comparison Note */}
      <p className="text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '300ms' }}>
        All plans include core gym management features. <br />
        Upgrade anytime to unlock more.
      </p>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        plan={PLANS.find(p => p.id === selectedPlan) || PLANS[0]}
        billingCycle={billingCycle}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default SubscriptionPage;
