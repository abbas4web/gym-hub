import { Client, Receipt } from '@/types/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Calendar, CreditCard, Receipt as ReceiptIcon, User, Trash2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface ClientDetailModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onGenerateReceipt: (client: Client) => void;
  onDelete: (clientId: string) => void;
  onRenew: (client: Client) => void;
}

const ClientDetailModal = ({ client, isOpen, onClose, onGenerateReceipt, onDelete, onRenew }: ClientDetailModalProps) => {
  if (!client) return null;

  const isExpired = new Date(client.endDate) < new Date();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-foreground">Client Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            {client.photo ? (
              <img 
                src={client.photo} 
                alt={client.name}
                className="w-20 h-20 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center">
                <User className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold font-heading text-foreground">{client.name}</h3>
              <span className={`inline-block mt-2 text-xs px-3 py-1 rounded-full font-medium capitalize ${
                isExpired ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'
              }`}>
                {isExpired ? 'Expired' : `${client.membershipType} Plan`}
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="glass-card p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-foreground font-medium">{client.phone}</p>
              </div>
            </div>
            {client.email && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-foreground font-medium">{client.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Membership Info */}
          <div className="glass-card p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Membership Period</p>
                <p className="text-foreground font-medium">
                  {format(new Date(client.startDate), 'dd MMM yyyy')} - {format(new Date(client.endDate), 'dd MMM yyyy')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Fee Paid</p>
                <p className="text-foreground font-medium text-lg">₹{client.fee.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => onGenerateReceipt(client)}
              >
                <ReceiptIcon className="h-4 w-4 mr-2" />
                Receipt
              </Button>
              <Button 
                className="flex-1"
                onClick={() => onRenew(client)}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Renew
              </Button>
            </div>
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => {
                onDelete(client.id);
                onClose();
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Client
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailModal;
