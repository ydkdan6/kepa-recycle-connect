import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/auth/AuthModal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Truck, Plus, Clock } from 'lucide-react';

const RequestsPage = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <Truck className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Access Required</h1>
            <p className="text-muted-foreground mb-6">
              Please sign in to view and manage your waste pickup requests.
            </p>
          </div>
          <Button 
            onClick={() => setShowAuthModal(true)}
            className="gradient-primary text-primary-foreground"
          >
            Sign In to Continue
          </Button>
        </div>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Pickup Requests</h1>
        <p className="text-muted-foreground">
          Manage your waste pickup requests and track their status
        </p>
      </div>

      <div className="mb-6">
        <Button className="gradient-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          New Pickup Request
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No pickup requests yet</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RequestsPage;