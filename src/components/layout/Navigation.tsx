import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Truck, 
  Calendar, 
  Megaphone, 
  User, 
  LogOut, 
  Menu, 
  X,
  BarChart3,
  Recycle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/auth/AuthModal';
import { Link, useLocation } from 'react-router-dom';

interface NavigationProps {
  onShowAuthModal?: () => void;
}

export const Navigation = ({ onShowAuthModal }: NavigationProps) => {
  const { user, profile, signOut, isKepaStaff } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/', forAll: true },
    { icon: Truck, label: 'My Requests', path: '/requests', forAll: false },
    { icon: Calendar, label: 'Schedules', path: '/schedules', forKepaOnly: true },
    { icon: Megaphone, label: 'Campaigns', path: '/campaigns', forAll: true },
    { icon: BarChart3, label: 'Analytics', path: '/analytics', forKepaOnly: true },
  ];

  const handleAuthClick = () => {
    if (onShowAuthModal) {
      onShowAuthModal();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  const filteredNavItems = navItems.filter(item => {
    if (item.forKepaOnly) return isKepaStaff;
    if (item.forAll) return true;
    return user; // Show for authenticated users only
  });

  return (
    <>
      <nav className="bg-card border-b border-border shadow-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 bg-primary rounded-lg">
                <Recycle className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-primary font-poppins">KEPA</span>
                <span className="text-xs text-muted-foreground font-poppins">Recycling Portal</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Auth Controls */}
            <div className="hidden md:flex items-center space-x-4">
              {user && isKepaStaff ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {profile?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      KEPA Staff
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              ) : (
                <Link to="/staff-login">
                  {/* <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Staff Login
                  </Button> */}
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="space-y-2">
                {filteredNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium w-full transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                
                <div className="pt-4 border-t border-border">
                  {user && isKepaStaff ? (
                    <div className="space-y-2">
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium text-foreground">
                          {profile?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          KEPA Staff
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleSignOut}
                        className="w-full justify-start"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Link to="/staff-login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-muted-foreground hover:text-foreground"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Staff Login
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};