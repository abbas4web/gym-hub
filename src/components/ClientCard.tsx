import { Client } from '@/types/client';
import { Phone, Calendar, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface ClientCardProps {
  client: Client;
  onClick: () => void;
  delay?: number;
}

const ClientCard = ({ client, onClick, delay = 0 }: ClientCardProps) => {
  const isExpired = new Date(client.endDate) < new Date();
  
  return (
    <div 
      className="glass-card p-4 flex items-center gap-4 cursor-pointer hover:border-primary/50 transition-all duration-200 animate-slide-up group"
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      <div className="relative">
        {client.photo ? (
          <img 
            src={client.photo} 
            alt={client.name}
            className="w-14 h-14 rounded-xl object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center">
            <span className="text-xl font-bold font-heading text-primary">
              {client.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${isExpired ? 'bg-destructive' : 'bg-primary'}`} />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold font-heading text-foreground truncate">{client.name}</h3>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Phone className="h-3 w-3" />
            <span>{client.phone}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
          <Calendar className="h-3 w-3" />
          <span>Expires: {format(new Date(client.endDate), 'dd MMM yyyy')}</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
          isExpired ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'
        }`}>
          {isExpired ? 'Expired' : client.membershipType}
        </span>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </div>
  );
};

export default ClientCard;
