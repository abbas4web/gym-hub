import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plan, BillingCycle } from '@/types/subscription';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan;
  billingCycle: BillingCycle;
  onSuccess: () => void;
}

const PaymentModal = ({ isOpen, onClose, plan, billingCycle, onSuccess }: PaymentModalProps) => {
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const { toast } = useToast();

  const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cardNumber.length < 19 || expiry.length < 5 || cvv.length < 3) {
      toast({
        title: "Invalid Card Details",
        description: "Please check your card information.",
        variant: "destructive",
      });
      return;
    }

    setStep('processing');

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    setStep('success');

    // Auto close after success
    setTimeout(() => {
      onSuccess();
      resetModal();
    }, 1500);
  };

  const resetModal = () => {
    setStep('details');
    setCardNumber('');
    setExpiry('');
    setCvv('');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-foreground flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            {step === 'success' ? 'Payment Successful!' : 'Complete Payment'}
          </DialogTitle>
        </DialogHeader>

        {step === 'success' ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Welcome to {plan.name}!</h3>
              <p className="text-muted-foreground text-sm">Your subscription is now active.</p>
            </div>
          </div>
        ) : step === 'processing' ? (
          <div className="py-12 text-center space-y-4">
            <div className="mx-auto w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Processing payment...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Order Summary */}
            <div className="glass-card p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium text-foreground">{plan.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Billing</span>
                <span className="font-medium text-foreground capitalize">{billingCycle}</span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">₹{price.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Demo Notice */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-start gap-2">
              <Lock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200">
                <strong>Demo Mode:</strong> No real payment will be processed. Use any test card numbers.
              </p>
            </div>

            {/* Card Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    maxLength={4}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full h-12">
              <Lock className="h-4 w-4 mr-2" />
              Pay ₹{price.toLocaleString()}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Secured by Stripe. Cancel anytime.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
