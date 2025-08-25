import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  Users, 
  Truck, 
  Calendar, 
  Megaphone,
  Settings,
  Shield,
  Recycle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StaffDashboard = () => {
  const { user, profile, isKepaStaff, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/staff-login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Recycle className="h-8 w-8 text-primary animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading KEPA Staff Portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  if (false) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <Shield className="h-16 w-16 text-warning mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            This dashboard is restricted to KEPA staff members only.
          </p>
          <Link to="/">
            <Button variant="outline">Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            KEPA Staff Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name || 'Staff Member'}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Requests
              </CardTitle>
              <Truck className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">24</div>
              <p className="text-xs text-muted-foreground">+2 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Users
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">2,847</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Today
              </CardTitle>
              <Recycle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">18</div>
              <p className="text-xs text-muted-foreground">Target: 20</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Weight Collected
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">1.2t</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/requests">
            <Card className="hover:shadow-primary transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2 h-5 w-5 text-primary" />
                  Pickup Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  View and manage all waste pickup requests from residents
                </p>
                <Button className="w-full gradient-primary text-primary-foreground">
                  Manage Requests
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/schedules">
            <Card className="hover:shadow-primary transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-secondary" />
                  Schedules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Assign pickup schedules to field teams and vehicles
                </p>
                <Button className="w-full" variant="secondary">
                  View Schedules
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/campaigns">
            <Card className="hover:shadow-primary transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Megaphone className="mr-2 h-5 w-5 text-warning" />
                  Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Create and manage recycling awareness campaigns
                </p>
                <Button className="w-full" variant="outline">
                  Manage Campaigns
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/analytics">
            <Card className="hover:shadow-primary transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-success" />
                  Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  View detailed analytics and performance reports
                </p>
                <Button className="w-full" variant="outline">
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-primary transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Manage user accounts and staff permissions
              </p>
              <Button className="w-full" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-primary transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5 text-muted-foreground" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Configure system preferences and notifications
              </p>
              <Button className="w-full" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;