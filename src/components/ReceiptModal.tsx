import { Receipt } from '@/types/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Share2, Check, Dumbbell } from 'lucide-react';
import { format } from 'date-fns';
import { useRef } from 'react';

interface ReceiptModalProps {
  receipt: Receipt | null;
  isOpen: boolean;
  onClose: () => void;
}

const ReceiptModal = ({ receipt, isOpen, onClose }: ReceiptModalProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!receipt) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Gym Receipt',
          text: `Receipt for ${receipt.clientName} - ₹${receipt.amount}`,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-foreground">Payment Receipt</DialogTitle>
        </DialogHeader>

        {/* Receipt Card */}
        <div ref={receiptRef} className="bg-gradient-to-br from-secondary to-card rounded-2xl p-6 mt-4 border border-border">
          {/* Gym Logo/Name */}
          <div className="text-center border-b border-border pb-4 mb-4">
            <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-xl mb-3">
              <Dumbbell className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold font-heading text-foreground">FitZone Gym</h2>
            <p className="text-muted-foreground text-sm">Premium Fitness Center</p>
          </div>

          {/* Receipt Details */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Receipt No.</span>
              <span className="text-foreground font-medium text-sm">#{receipt.id.slice(-8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Date</span>
              <span className="text-foreground font-medium text-sm">
                {format(new Date(receipt.generatedAt), 'dd MMM yyyy')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Client Name</span>
              <span className="text-foreground font-medium text-sm">{receipt.clientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Plan</span>
              <span className="text-foreground font-medium text-sm capitalize">{receipt.membershipType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Valid Till</span>
              <span className="text-foreground font-medium text-sm">
                {format(new Date(receipt.endDate), 'dd MMM yyyy')}
              </span>
            </div>
          </div>

          {/* Amount */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="text-foreground font-semibold">Total Amount</span>
              <span className="text-2xl font-bold font-heading text-primary">₹{receipt.amount.toLocaleString()}</span>
            </div>
          </div>

          {/* Paid Badge */}
          <div className="mt-4 flex items-center justify-center gap-2 text-primary">
            <div className="p-1 bg-primary rounded-full">
              <Check className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">PAID</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <Button variant="outline" className="flex-1" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button className="flex-1" onClick={onClose}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptModal;
