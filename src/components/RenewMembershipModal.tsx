import { useState } from 'react';
import { Client, MembershipType } from '@/types/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getMembershipFee, getMembershipDuration, calculateEndDate } from '@/lib/clientStore';
import { RefreshCw, Calendar, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

interface RenewMembershipModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onRenew: (client: Client, newMembershipType: MembershipType) => void;
}

const RenewMembershipModal = ({ client, isOpen, onClose, onRenew }: RenewMembershipModalProps) => {
  const [membershipType, setMembershipType] = useState<MembershipType>('monthly');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!client) return null;

  const fee = getMembershipFee(membershipType);
  const duration = getMembershipDuration(membershipType);
  
  // New start date is either today or the day after current end date (whichever is later)
  const today = new Date();
  const currentEndDate = new Date(client.endDate);
  const newStartDate = currentEndDate > today 
    ? new Date(currentEndDate.getTime() + 24 * 60 * 60 * 1000) // Day after current end
    : today;
  const newEndDate = new Date(newStartDate);
  newEndDate.setMonth(newEndDate.getMonth() + duration);

  const handleRenew = async () => {
    setIsSubmitting(true);
    
    const updatedClient: Client = {
      ...client,
      membershipType,
      startDate: newStartDate.toISOString().split('T')[0],
      endDate: newEndDate.toISOString().split('T')[0],
      fee,
      isActive: true,
    };
    
    onRenew(updatedClient, membershipType);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-foreground flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            Renew Membership
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Client Info */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            {client.photo ? (
              <img 
                src={client.photo} 
                alt={client.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-lg">
                  {client.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p className="font-semibold text-foreground">{client.name}</p>
              <p className="text-sm text-muted-foreground">
                Current: {client.membershipType} (expires {format(new Date(client.endDate), 'dd MMM yyyy')})
              </p>
            </div>
          </div>

          {/* Membership Selection */}
          <div className="space-y-2">
            <Label>New Membership Plan</Label>
            <Select value={membershipType} onValueChange={(v) => setMembershipType(v as MembershipType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly - ₹1,500</SelectItem>
                <SelectItem value="quarterly">Quarterly - ₹4,000</SelectItem>
                <SelectItem value="yearly">Yearly - ₹15,000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Renewal Summary */}
          <div className="glass-card p-4 space-y-3">
            <h4 className="font-medium text-foreground">Renewal Summary</h4>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">New Period</p>
                <p className="text-foreground font-medium">
                  {format(newStartDate, 'dd MMM yyyy')} - {format(newEndDate, 'dd MMM yyyy')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Amount to Pay</p>
                <p className="text-foreground font-bold text-xl">₹{fee.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              className="flex-1"
              onClick={handleRenew}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Renew & Pay ₹{fee.toLocaleString()}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RenewMembershipModal;
