import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Plan, BillingCycle } from '@/types/subscription';
import { Badge } from '@/components/ui/badge';

interface PricingCardProps {
  plan: Plan;
  billingCycle: BillingCycle;
  isCurrentPlan: boolean;
  onSelect: () => void;
}

const PricingCard = ({ plan, billingCycle, isCurrentPlan, onSelect }: PricingCardProps) => {
  const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  const monthlyEquivalent = billingCycle === 'yearly' ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice;
  const savings = billingCycle === 'yearly' && plan.monthlyPrice > 0 
    ? Math.round((1 - plan.yearlyPrice / (plan.monthlyPrice * 12)) * 100) 
    : 0;

  return (
    <div 
      className={`glass-card p-6 relative flex flex-col h-full transition-all duration-300 ${
        plan.popular 
          ? 'border-primary ring-2 ring-primary/20' 
          : isCurrentPlan 
            ? 'border-green-500/50' 
            : ''
      }`}
    >
      {plan.popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
          Most Popular
        </Badge>
      )}
      
      {isCurrentPlan && (
        <Badge variant="outline" className="absolute -top-3 right-4 border-green-500 text-green-500">
          Current Plan
        </Badge>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold font-heading text-foreground">{plan.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold font-heading text-foreground">
            {price === 0 ? 'Free' : `₹${monthlyEquivalent.toLocaleString()}`}
          </span>
          {price > 0 && (
            <span className="text-muted-foreground">/mo</span>
          )}
        </div>
        {billingCycle === 'yearly' && price > 0 && (
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              ₹{price.toLocaleString()}/year
            </span>
            {savings > 0 && (
              <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                Save {savings}%
              </Badge>
            )}
          </div>
        )}
      </div>

      <ul className="space-y-3 mb-6 flex-1">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="p-1 rounded-full bg-primary/20 shrink-0 mt-0.5">
              <Check className="h-3 w-3 text-primary" />
            </div>
            <span className="text-sm text-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <Button 
        className="w-full"
        variant={plan.popular ? 'default' : 'outline'}
        disabled={isCurrentPlan}
        onClick={onSelect}
      >
        {isCurrentPlan 
          ? 'Current Plan' 
          : plan.id === 'free' 
            ? 'Downgrade' 
            : 'Upgrade Now'
        }
      </Button>
    </div>
  );
};

export default PricingCard;
