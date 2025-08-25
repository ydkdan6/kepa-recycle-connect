import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Truck, 
  Plus, 
  Clock, 
  MapPin, 
  Calendar,
  Check,
  X,
  User
} from 'lucide-react';

type PickupStatus = 'requested' | 'scheduled' | 'in_progress' | 'completed' | 'delayed';

interface PickupRequest {
  id: string;
  user_id: string;
  waste_type: string;
  quantity_kg: number;
  pickup_address: string;
  preferred_date: string | null;
  status: PickupStatus;
  created_at: string;
  notes: string | null;
  photo_url: string | null;
  profiles?: {
    full_name: string;
    phone: string | null;
  } | null;
}

const RequestsPage = () => {
  const { user, isKepaStaff } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && isKepaStaff) {
      fetchRequests();
    }
  }, [user, isKepaStaff]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('pickup_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch profiles separately
      const requestsWithProfiles = await Promise.all(
        (data || []).map(async (request) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, phone')
            .eq('user_id', request.user_id)
            .single();
          
          return {
            ...request,
            profiles: profile
          };
        })
      );
      
      setRequests(requestsWithProfiles as PickupRequest[]);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Error",
        description: "Failed to load pickup requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, newStatus: 'scheduled' | 'delayed') => {
    try {
      const { error } = await supabase
        .from('pickup_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) throw error;

      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      ));

      toast({
        title: "Success",
        description: `Request ${newStatus === 'scheduled' ? 'scheduled' : 'delayed'} successfully`
      });
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive"
      });
    }
  };

  if (!user || !isKepaStaff) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <Truck className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Access Restricted</h1>
            <p className="text-muted-foreground mb-6">
              This page is only accessible to KEPA staff members.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Truck className="h-8 w-8 text-primary animate-pulse mx-auto mb-2" />
            <p className="text-muted-foreground">Loading requests...</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      requested: 'secondary',
      scheduled: 'default',
      in_progress: 'outline',
      completed: 'default',
      delayed: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Pickup Requests</h1>
        <p className="text-muted-foreground">
          Manage and respond to waste pickup requests from residents
        </p>
      </div>

      <div className="grid gap-6">
        {requests.length === 0 ? (
          <Card className="p-8">
            <div className="text-center">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No requests yet</h3>
              <p className="text-muted-foreground">Pickup requests will appear here when residents submit them.</p>
            </div>
          </Card>
        ) : (
          requests.map((request) => (
            <Card key={request.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      {request.profiles?.full_name || 'Unknown User'}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {request.profiles?.phone || 'No phone provided'}
                    </p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="h-4 w-4 text-primary" />
                      <span className="font-medium">Waste Type:</span>
                      <span className="capitalize">{request.waste_type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Quantity:</span>
                      <span>{request.quantity_kg} kg</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">Address:</span>
                      <span className="flex-1">{request.pickup_address}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium">Preferred Date:</span>
                      <span>{request.preferred_date ? new Date(request.preferred_date).toLocaleDateString() : 'Any time'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium">Requested:</span>
                      <span>{new Date(request.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {request.notes && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Notes:</p>
                    <p className="text-sm text-muted-foreground">{request.notes}</p>
                  </div>
                )}

                {request.status === 'requested' && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => updateRequestStatus(request.id, 'scheduled')}
                      className="bg-success hover:bg-success/90 text-success-foreground"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateRequestStatus(request.id, 'delayed')}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Delay
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RequestsPage;