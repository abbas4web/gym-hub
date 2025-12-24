import { useState } from 'react';
import { Client } from '@/types/client';
import ClientCard from './ClientCard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Plus, Users, Filter } from 'lucide-react';

interface ClientsListProps {
  clients: Client[];
  onAddClient: () => void;
  onClientClick: (client: Client) => void;
}

const ClientsList = ({ clients, onAddClient, onClientClick }: ClientsListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');

  const filteredClients = clients
    .filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone.includes(searchQuery);
      
      if (filter === 'all') return matchesSearch;
      const isExpired = new Date(client.endDate) < new Date();
      if (filter === 'active') return matchesSearch && !isExpired;
      if (filter === 'expired') return matchesSearch && isExpired;
      return matchesSearch;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'expired', label: 'Expired' },
  ] as const;

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Clients</h1>
          <p className="text-muted-foreground text-sm mt-1">{clients.length} total members</p>
        </div>
        <Button size="icon" className="rounded-xl h-11 w-11" onClick={onAddClient}>
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Search */}
      <div className="relative animate-slide-up" style={{ animationDelay: '100ms' }}>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search by name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 bg-secondary border-border focus:border-primary rounded-xl"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 animate-slide-up" style={{ animationDelay: '200ms' }}>
        {filterOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setFilter(option.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              filter === option.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Client List */}
      {filteredClients.length > 0 ? (
        <div className="space-y-3">
          {filteredClients.map((client, index) => (
            <ClientCard 
              key={client.id} 
              client={client} 
              onClick={() => onClientClick(client)}
              delay={300 + (index * 50)}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card p-8 text-center animate-fade-in">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            {searchQuery ? 'No clients found' : 'No clients yet'}
          </p>
          {!searchQuery && (
            <Button className="mt-4" onClick={onAddClient}>
              Add Your First Client
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientsList;
