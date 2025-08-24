import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthModal } from '@/components/auth/AuthModal';
import { useToast } from '@/hooks/use-toast';
import { 
  Recycle, 
  Truck, 
  Users, 
  MapPin, 
  Calendar, 
  Plus,
  Leaf,
  Globe,
  Shield,
  TrendingUp,
  Phone,
  MessageSquare,
  Award
} from 'lucide-react';

type WasteType = 'plastic' | 'paper' | 'organic' | 'electronics' | 'glass' | 'metal' | 'mixed';

interface PickupRequest {
  waste_type: WasteType;
  quantity_kg: number;
  pickup_address: string;
  preferred_date: string;
  notes?: string;
}

const Index = () => {
  const { user, profile, isKepaStaff, loading } = useAuth();
  const { toast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);
  
  // Analytics data for public dashboard
  const [publicStats, setPublicStats] = useState({
    totalRequests: 1234,
    wasteCollected: 45.2,
    activeUsers: 2847,
    co2Saved: 128
  });

  const [requestForm, setRequestForm] = useState<PickupRequest>({
    waste_type: 'plastic',
    quantity_kg: 0,
    pickup_address: '',
    preferred_date: '',
    notes: ''
  });

  // Handle geolocation
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, you'd reverse geocode this to an address
          setRequestForm(prev => ({
            ...prev,
            pickup_address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
          }));
          toast({
            title: "Location detected",
            description: "Your location has been added to the request"
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enter address manually.",
            variant: "destructive"
          });
        }
      );
    }
  };

  const handleSubmitRequest = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!requestForm.waste_type || !requestForm.quantity_kg || !requestForm.pickup_address) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setSubmittingRequest(true);
    try {
      const { error } = await supabase.from('pickup_requests').insert([
        {
          user_id: user.id,
          ...requestForm,
          preferred_date: requestForm.preferred_date || null
        }
      ]);

      if (error) throw error;

      toast({
        title: "Request Submitted!",
        description: "Your pickup request has been submitted successfully",
      });

      // Reset form
      setRequestForm({
        waste_type: 'plastic',
        quantity_kg: 0,
        pickup_address: '',
        preferred_date: '',
        notes: ''
      });
      setShowRequestForm(false);
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit request",
        variant: "destructive"
      });
    } finally {
      setSubmittingRequest(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Recycle className="h-8 w-8 text-primary animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading KEPA Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-shadow">
              Sustainable Waste Management for Kaduna State
            </h1>
            <p className="text-lg lg:text-xl mb-8 opacity-90">
              Join KEPA's digital recycling initiative. Request pickups, track progress, and contribute to a cleaner, greener Kaduna.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={() => setShowRequestForm(true)}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Request Pickup
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={() => setShowAuthModal(true)}
                >
                  <Users className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
              )}
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                <Phone className="mr-2 h-5 w-5" />
                Contact KEPA
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Community Impact
            </h2>
            <p className="text-muted-foreground">
              See how Kaduna residents are making a difference
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="p-4 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                {publicStats.totalRequests.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Pickup Requests</p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Recycle className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                {publicStats.wasteCollected} tons
              </div>
              <p className="text-sm text-muted-foreground">Waste Collected</p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                {publicStats.activeUsers.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                {publicStats.co2Saved} kg
              </div>
              <p className="text-sm text-muted-foreground">CO₂ Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* User Dashboard or Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {user ? (
            // Authenticated User Dashboard
            <div>
              <div className="mb-8 text-center">
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                  Welcome back, {profile?.full_name || 'User'}!
                </h2>
                <p className="text-muted-foreground">
                  {isKepaStaff ? 'Manage recycling operations' : 'Manage your waste recycling'}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="hover:shadow-primary transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Truck className="mr-2 h-5 w-5 text-primary" />
                      Quick Request
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">
                      Submit a new waste pickup request
                    </p>
                    <Button 
                      className="w-full gradient-primary text-primary-foreground"
                      onClick={() => setShowRequestForm(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      New Request
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-primary transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="mr-2 h-5 w-5 text-warning" />
                      Your Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary mb-2">
                      {profile?.points || 0}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Earned from recycling activities
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-primary transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="mr-2 h-5 w-5 text-secondary" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      No recent requests
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            // Public Features Section
            <div>
              <div className="text-center mb-12">
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  Why Choose KEPA Digital Recycling?
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Our platform makes waste management convenient, trackable, and environmentally impactful for all Kaduna residents.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="p-4 bg-primary/10 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Easy Pickup Requests</h3>
                  <p className="text-muted-foreground text-sm">
                    Schedule waste pickups with just a few clicks. Specify waste type, quantity, and preferred dates.
                  </p>
                </div>

                <div className="text-center">
                  <div className="p-4 bg-primary/10 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Real-time Tracking</h3>
                  <p className="text-muted-foreground text-sm">
                    Monitor your request status from submission to completion with live updates.
                  </p>
                </div>

                <div className="text-center">
                  <div className="p-4 bg-primary/10 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Environmental Impact</h3>
                  <p className="text-muted-foreground text-sm">
                    See your contribution to Kaduna's environmental goals and earn rewards for recycling.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Pickup Request Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-foreground">Request Waste Pickup</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowRequestForm(false)}
                >
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="waste-type">Waste Type *</Label>
                  <Select value={requestForm.waste_type} onValueChange={(value: WasteType) => 
                    setRequestForm(prev => ({ ...prev, waste_type: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select waste type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plastic">Plastic</SelectItem>
                      <SelectItem value="paper">Paper</SelectItem>
                      <SelectItem value="organic">Organic</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="glass">Glass</SelectItem>
                      <SelectItem value="metal">Metal</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quantity">Estimated Weight (kg) *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    placeholder="e.g., 5"
                    value={requestForm.quantity_kg || ''}
                    onChange={(e) => setRequestForm(prev => ({ 
                      ...prev, 
                      quantity_kg: parseInt(e.target.value) || 0 
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Pickup Address *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="address"
                      placeholder="Enter pickup address"
                      value={requestForm.pickup_address}
                      onChange={(e) => setRequestForm(prev => ({ 
                        ...prev, 
                        pickup_address: e.target.value 
                      }))}
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={handleGetLocation}
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="preferred-date">Preferred Date (Optional)</Label>
                  <Input
                    id="preferred-date"
                    type="date"
                    value={requestForm.preferred_date}
                    onChange={(e) => setRequestForm(prev => ({ 
                      ...prev, 
                      preferred_date: e.target.value 
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions or details..."
                    value={requestForm.notes}
                    onChange={(e) => setRequestForm(prev => ({ 
                      ...prev, 
                      notes: e.target.value 
                    }))}
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowRequestForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmitRequest}
                    disabled={submittingRequest}
                    className="flex-1 gradient-primary text-primary-foreground"
                  >
                    {submittingRequest ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default Index;
