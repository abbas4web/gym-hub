import { useMemo } from 'react';
import { Client, Receipt } from '@/types/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, IndianRupee, PieChart as PieChartIcon } from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

interface AnalyticsDashboardProps {
  clients: Client[];
  receipts: Receipt[];
}

const MEMBERSHIP_COLORS = {
  monthly: 'hsl(var(--chart-1))',
  quarterly: 'hsl(var(--chart-2))',
  yearly: 'hsl(var(--chart-3))',
};

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))',
  },
  clients: {
    label: 'Clients',
    color: 'hsl(var(--chart-2))',
  },
  monthly: {
    label: 'Monthly',
    color: 'hsl(var(--chart-1))',
  },
  quarterly: {
    label: 'Quarterly',
    color: 'hsl(var(--chart-2))',
  },
  yearly: {
    label: 'Yearly',
    color: 'hsl(var(--chart-3))',
  },
};

const AnalyticsDashboard = ({ clients, receipts }: AnalyticsDashboardProps) => {
  // Calculate monthly revenue for last 6 months
  const monthlyRevenueData = useMemo(() => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const monthRevenue = receipts
        .filter(r => {
          const receiptDate = parseISO(r.generatedAt);
          return isWithinInterval(receiptDate, { start: monthStart, end: monthEnd });
        })
        .reduce((sum, r) => sum + r.amount, 0);
      
      data.push({
        month: format(date, 'MMM'),
        revenue: monthRevenue,
      });
    }
    return data;
  }, [receipts]);

  // Calculate client growth over last 6 months
  const clientGrowthData = useMemo(() => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthEnd = endOfMonth(date);
      
      const clientsCount = clients.filter(c => {
        const createdDate = parseISO(c.createdAt);
        return createdDate <= monthEnd;
      }).length;
      
      data.push({
        month: format(date, 'MMM'),
        clients: clientsCount,
      });
    }
    return data;
  }, [clients]);

  // Calculate membership distribution
  const membershipDistribution = useMemo(() => {
    const distribution = {
      monthly: 0,
      quarterly: 0,
      yearly: 0,
    };
    
    clients.forEach(client => {
      distribution[client.membershipType]++;
    });
    
    return [
      { name: 'Monthly', value: distribution.monthly, fill: MEMBERSHIP_COLORS.monthly },
      { name: 'Quarterly', value: distribution.quarterly, fill: MEMBERSHIP_COLORS.quarterly },
      { name: 'Yearly', value: distribution.yearly, fill: MEMBERSHIP_COLORS.yearly },
    ].filter(item => item.value > 0);
  }, [clients]);

  // Summary stats
  const totalRevenue = receipts.reduce((sum, r) => sum + r.amount, 0);
  const currentMonthRevenue = monthlyRevenueData[monthlyRevenueData.length - 1]?.revenue || 0;
  const previousMonthRevenue = monthlyRevenueData[monthlyRevenueData.length - 2]?.revenue || 0;
  const revenueGrowth = previousMonthRevenue > 0 
    ? Math.round(((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100)
    : 0;

  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <PieChartIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Analytics Yet</h3>
        <p className="text-muted-foreground">Add clients to see your analytics dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <IndianRupee className="h-4 w-4" />
              <span className="text-xs">This Month</span>
            </div>
            <p className="text-xl font-bold text-foreground">₹{currentMonthRevenue.toLocaleString()}</p>
            {revenueGrowth !== 0 && (
              <p className={`text-xs ${revenueGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {revenueGrowth > 0 ? '+' : ''}{revenueGrowth}% vs last month
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Total Revenue</span>
            </div>
            <p className="text-xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Chart */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-primary" />
            Monthly Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart data={monthlyRevenueData}>
              <XAxis 
                dataKey="month" 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={(value) => `₹${value >= 1000 ? `${value/1000}k` : value}`}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
              />
              <Bar 
                dataKey="revenue" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Client Growth Chart */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Client Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <LineChart data={clientGrowthData}>
              <XAxis 
                dataKey="month" 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value) => [value, 'Clients']}
              />
              <Line 
                type="monotone" 
                dataKey="clients" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Membership Distribution */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <PieChartIcon className="h-4 w-4 text-primary" />
            Membership Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          {membershipDistribution.length > 0 ? (
            <div className="flex items-center justify-between">
              <ChartContainer config={chartConfig} className="h-[160px] w-[160px]">
                <PieChart>
                  <Pie
                    data={membershipDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {membershipDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                  />
                </PieChart>
              </ChartContainer>
              
              <div className="space-y-2">
                {membershipDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                    <span className="text-sm font-medium text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No membership data</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
