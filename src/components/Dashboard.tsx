import { Client } from '@/types/client';
import StatCard from './StatCard';
import ClientCard from './ClientCard';
import { Users, UserCheck, UserX, IndianRupee, Plus } from 'lucide-react';
import { Button } from './ui/button';

interface DashboardProps {
  clients: Client[];
  onAddClient: () => void;
  onClientClick: (client: Client) => void;
}

const Dashboard = ({ clients, onAddClient, onClientClick }: DashboardProps) => {
  const activeClients = clients.filter(c => new Date(c.endDate) >= new Date());
  const expiredClients = clients.filter(c => new Date(c.endDate) < new Date());
  const totalRevenue = clients.reduce((sum, c) => sum + c.fee, 0);
  const recentClients = [...clients].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Welcome back, Admin</p>
        </div>
        <Button size="icon" className="rounded-xl h-11 w-11" onClick={onAddClient}>
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Total Clients"
          value={clients.length}
          icon={Users}
          delay={100}
        />
        <StatCard
          title="Active"
          value={activeClients.length}
          icon={UserCheck}
          trend={`${Math.round((activeClients.length / Math.max(clients.length, 1)) * 100)}% of total`}
          delay={200}
        />
        <StatCard
          title="Expired"
          value={expiredClients.length}
          icon={UserX}
          delay={300}
        />
        <StatCard
          title="Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={IndianRupee}
          delay={400}
        />
      </div>

      {/* Recent Clients */}
      <div className="animate-slide-up" style={{ animationDelay: '500ms' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold font-heading text-foreground">Recent Clients</h2>
          <span className="text-primary text-sm font-medium">View all</span>
        </div>
        
        {recentClients.length > 0 ? (
          <div className="space-y-3">
            {recentClients.map((client, index) => (
              <ClientCard 
                key={client.id} 
                client={client} 
                onClick={() => onClientClick(client)}
                delay={600 + (index * 100)}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No clients yet</p>
            <Button className="mt-4" onClick={onAddClient}>
              Add Your First Client
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
