import { Receipt } from '@/types/client';
import { Receipt as ReceiptIcon, Calendar, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';

interface ReceiptsListProps {
  receipts: Receipt[];
  onReceiptClick: (receipt: Receipt) => void;
}

const ReceiptsList = ({ receipts, onReceiptClick }: ReceiptsListProps) => {
  const sortedReceipts = [...receipts].sort((a, b) => 
    new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
  );

  const totalAmount = receipts.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold font-heading text-foreground">Receipts</h1>
        <p className="text-muted-foreground text-sm mt-1">{receipts.length} receipts generated</p>
      </div>

      {/* Summary Card */}
      <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">Total Collection</p>
            <p className="text-3xl font-bold font-heading text-foreground mt-1">
              ₹{totalAmount.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-primary/10 rounded-xl">
            <IndianRupee className="h-8 w-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Receipts List */}
      {sortedReceipts.length > 0 ? (
        <div className="space-y-3">
          {sortedReceipts.map((receipt, index) => (
            <div
              key={receipt.id}
              onClick={() => onReceiptClick(receipt)}
              className="glass-card p-4 cursor-pointer hover:border-primary/50 transition-all duration-200 animate-slide-up"
              style={{ animationDelay: `${200 + (index * 50)}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <ReceiptIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold font-heading text-foreground">{receipt.clientName}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(receipt.generatedAt), 'dd MMM yyyy, hh:mm a')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold font-heading text-primary">₹{receipt.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground capitalize">{receipt.membershipType}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-8 text-center animate-fade-in">
          <ReceiptIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No receipts generated yet</p>
        </div>
      )}
    </div>
  );
};

export default ReceiptsList;
