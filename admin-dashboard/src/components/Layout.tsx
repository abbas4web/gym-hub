import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Users, LogOut, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { superAdmin, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admins', icon: Users, label: 'Admins' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-card border-r border-border transition-all duration-300 flex flex-col`}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          {isSidebarOpen && (
            <div>
              <h1 className="text-xl font-bold text-primary">Gym Hub</h1>
              <p className="text-xs text-muted-foreground">Super Admin</p>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-muted rounded-lg"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 w-full transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{superAdmin?.name}</p>
                <p className="text-xs text-muted-foreground">{superAdmin?.email}</p>
              </div>
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold">
                  {superAdmin?.name.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
