import { Dumbbell, Bell, Shield, HelpCircle, LogOut, ChevronRight, Moon, Smartphone } from 'lucide-react';
import { Button } from './ui/button';

const SettingsPage = () => {
  const settingsItems = [
    { icon: Dumbbell, label: 'Gym Profile', description: 'Update gym details' },
    { icon: Bell, label: 'Notifications', description: 'Manage alerts & reminders' },
    { icon: Shield, label: 'Privacy & Security', description: 'Password & data settings' },
    { icon: Moon, label: 'Appearance', description: 'Theme preferences' },
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

      {/* Gym Info Card */}
      <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/20 rounded-2xl">
            <Dumbbell className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-foreground">FitZone Gym</h2>
            <p className="text-muted-foreground text-sm">Premium Fitness Center</p>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="space-y-2">
        {settingsItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className="w-full glass-card p-4 flex items-center gap-4 hover:border-primary/50 transition-all duration-200 animate-slide-up"
              style={{ animationDelay: `${200 + (index * 50)}ms` }}
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
