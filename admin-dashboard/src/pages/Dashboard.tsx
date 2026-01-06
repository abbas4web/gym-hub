import React, { useEffect, useState } from 'react';
import { superAdminAPI } from '../services/api';
import { Users, UserCheck, UserX, DollarSign, TrendingUp } from 'lucide-react';

interface Stats {
  totalAdmins: number;
  activeAdmins: number;
  suspendedAdmins: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await superAdminAPI.getDashboardStats();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Admins',
      value: stats?.totalAdmins || 0,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Active Admins',
      value: stats?.activeAdmins || 0,
      icon: UserCheck,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Suspended',
      value: stats?.suspendedAdmins || 0,
      icon: UserX,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Monthly Revenue',
      value: `₹${(stats?.monthlyRevenue || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Welcome to Gym Hub Super Admin
        </h2>
        <p className="text-muted-foreground">
          Manage all gym administrators, monitor subscriptions, and view system analytics from this dashboard.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admins"
            className="p-4 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <Users className="w-6 h-6 text-primary mb-2" />
            <p className="font-medium text-foreground">View All Admins</p>
            <p className="text-sm text-muted-foreground">Manage gym administrators</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
