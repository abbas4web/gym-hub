import { useEffect, useState } from 'react';
import { superAdminAPI } from '../services/api';
import { Search, Ban, CheckCircle } from 'lucide-react';

interface Admin {
  id: string;
  name: string;
  email: string;
  gym_name: string;
  subscription_plan: string;
  status: string;
  client_count: number;
  total_revenue: number;
  created_at: string;
}

const Admins = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadAdmins();
  }, [search, statusFilter]);

  const loadAdmins = async () => {
    try {
      const params: any = {};
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;

      const response = await superAdminAPI.getAdmins(params);
      if (response.success) {
        setAdmins(response.admins);
      }
    } catch (error) {
      console.error('Failed to load admins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await superAdminAPI.updateAdminStatus(id, newStatus);
      if (response.success) {
        loadAdmins();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-500/10 text-green-500 border-green-500/30',
      suspended: 'bg-red-500/10 text-red-500 border-red-500/30',
    };
    return styles[status as keyof typeof styles] || styles.active;
  };

  const getPlanBadge = (plan: string) => {
    const styles = {
      free: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
      pro: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      premium: 'bg-primary/10 text-primary border-primary/30',
    };
    return styles[plan as keyof typeof styles] || styles.free;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or gym..."
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : admins.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No admins found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Admin</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Gym Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Plan</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Clients</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Revenue</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">{admin.name}</p>
                        <p className="text-sm text-muted-foreground">{admin.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground">{admin.gym_name || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPlanBadge(admin.subscription_plan)}`}>
                        {admin.subscription_plan.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground">{admin.client_count || 0}</td>
                    <td className="px-6 py-4 text-foreground">₹{(admin.total_revenue || 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(admin.status)}`}>
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {admin.status === 'active' ? (
                          <button
                            onClick={() => handleStatusChange(admin.id, 'suspended')}
                            className="p-2 hover:bg-destructive/10 rounded-lg text-destructive transition-colors"
                            title="Suspend Admin"
                          >
                            <Ban size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(admin.id, 'active')}
                            className="p-2 hover:bg-green-500/10 rounded-lg text-green-500 transition-colors"
                            title="Activate Admin"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admins;
