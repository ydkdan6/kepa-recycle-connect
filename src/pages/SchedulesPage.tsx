import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/auth/AuthModal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Shield } from 'lucide-react';

const SchedulesPage = () => {
  const { user, isKepaStaff } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">KEPA Staff Only</h1>
            <p className="text-muted-foreground mb-6">
              This section is restricted to KEPA officials only.
            </p>
          </div>
          <Button 
            onClick={() => setShowAuthModal(true)}
            className="gradient-primary text-primary-foreground"
          >
            KEPA Staff Sign In
          </Button>
        </div>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    );
  }

  if (!isKepaStaff) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <Shield className="h-16 w-16 text-warning mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground">
            This section is restricted to KEPA staff members only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Pickup Schedules</h1>
        <p className="text-muted-foreground">
          Manage and assign pickup schedules to field teams
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Schedule management coming soon</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SchedulesPage;