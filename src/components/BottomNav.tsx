import { Home, Users, Receipt, Settings, Bell, BarChart3 } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'clients', icon: Users, label: 'Clients' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'receipts', icon: Receipt, label: 'Receipts' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border z-50">
      <div className="max-w-md mx-auto flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 min-w-[64px] ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-primary/20' : ''
              }`}>
                <Icon className={`h-5 w-5 transition-all duration-200 ${isActive ? 'scale-110' : ''}`} />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
