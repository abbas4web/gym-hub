import { Dumbbell, Bell, Shield, HelpCircle, LogOut, ChevronRight, Moon, Sun, Smartphone, Crown } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';

interface SettingsPageProps {
  onUpgrade: () => void;
}

const SettingsPage = ({ onUpgrade }: SettingsPageProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { currentPlan } = useSubscription();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You've been signed out successfully.",
    });
    navigate('/auth/login');
  };

  const settingsItems = [
    { icon: Dumbbell, label: 'Gym Profile', description: 'Update gym details' },
    { icon: Bell, label: 'Notifications', description: 'Manage alerts & reminders' },
    { icon: Shield, label: 'Privacy & Security', description: 'Password & data settings' },
    { icon: Smartphone, label: 'Install App', description: 'Add to home screen' },
    { icon: HelpCircle, label: 'Help & Support', description: 'FAQs & contact' },
  ];

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold font-heading text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your preferences</p>
      </div>

      {/* User Info Card */}
      <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/20 rounded-2xl">
            <Dumbbell className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-foreground">{user?.name || 'FitZone Gym'}</h2>
            <p className="text-muted-foreground text-sm">{user?.email || 'Premium Fitness Center'}</p>
          </div>
        </div>
      </div>

      {/* Subscription Card */}
      <button
        onClick={onUpgrade}
        className="w-full glass-card p-4 flex items-center gap-4 hover:border-primary/50 transition-all duration-200 animate-slide-up"
        style={{ animationDelay: '150ms' }}
      >
        <div className="p-2 bg-primary/20 rounded-xl">
          <Crown className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <p className="font-medium text-foreground">Subscription</p>
            <Badge variant="secondary" className="text-xs">{currentPlan.name}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Manage your plan & billing</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </button>

      {/* Theme Toggle */}
      <div 
        className="glass-card p-4 flex items-center gap-4 animate-slide-up"
        style={{ animationDelay: '200ms' }}
      >
        <div className="p-2 bg-secondary rounded-xl">
          {theme === 'dark' ? (
            <Moon className="h-5 w-5 text-primary" />
          ) : (
            <Sun className="h-5 w-5 text-primary" />
          )}
        </div>
        <div className="flex-1 text-left">
          <p className="font-medium text-foreground">Dark Mode</p>
          <p className="text-sm text-muted-foreground">Toggle light/dark theme</p>
        </div>
        <Switch
          checked={theme === 'dark'}
          onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        />
      </div>

      {/* Settings List */}
      <div className="space-y-2">
        {settingsItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className="w-full glass-card p-4 flex items-center gap-4 hover:border-primary/50 transition-all duration-200 animate-slide-up"
              style={{ animationDelay: `${250 + (index * 50)}ms` }}
            >
              <div className="p-2 bg-secondary rounded-xl">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          );
        })}
      </div>

      {/* Logout Button */}
      <Button 
        variant="outline" 
        className="w-full h-12 border-destructive/50 text-destructive hover:bg-destructive/10 animate-slide-up"
        style={{ animationDelay: '500ms' }}
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5 mr-2" />
        Log Out
      </Button>

      {/* Version */}
      <p className="text-center text-muted-foreground text-sm animate-fade-in" style={{ animationDelay: '600ms' }}>
        FitZone Gym Manager v1.0.0
      </p>
    </div>
  );
};

export default SettingsPage;
