import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Megaphone, Calendar, MapPin, Users, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const CampaignsPage = () => {
  const { isAdmin } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Recycling Campaigns</h1>
          <p className="text-muted-foreground">
            Join our community recycling initiatives and make a difference
          </p>
        </div>
        {isAdmin && (
          <Button className="gradient-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample Campaign */}
        <Card className="p-6 hover:shadow-primary transition-shadow">
          <div className="mb-4">
            <div className="p-3 bg-primary/10 rounded-lg w-fit mb-3">
              <Megaphone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Earth Day Cleanup Drive
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Join us for a community-wide cleanup initiative to celebrate Earth Day and promote environmental awareness in Kaduna.
            </p>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              April 22, 2025 - April 24, 2025
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              Central Park, Kaduna
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              45 participants registered
            </div>
          </div>
          
          <Button className="w-full gradient-secondary text-secondary-foreground">
            Join Campaign
          </Button>
        </Card>

        {/* Coming Soon Card */}
        <Card className="p-6 border-dashed">
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <Megaphone className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">More campaigns coming soon</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CampaignsPage;