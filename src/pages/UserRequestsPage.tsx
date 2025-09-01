import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  Truck, 
  Clock, 
  MapPin, 
  CalendarIcon,
  User,
  Phone,
  Mail,
  Package,
  CheckCircle,
  Trash2,
  MessageCircle
} from 'lucide-react';

type PickupStatus = 'requested' | 'scheduled' | 'in_progress' | 'completed' | 'delayed';

interface PickupRequest {
  id: string;
  user_id: string | null;
  waste_type: string;
  quantity_kg: number;
  pickup_address: string;
  preferred_date: string | null;
  status: PickupStatus;
  created_at: string;
  notes: string | null;
  photo_url: string | null;
  contact_phone: string | null;
  contact_email: string | null;
}

const UserRequestsPage = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    fetchAllRequests();
  }, [selectedDate]);

  const fetchAllRequests = async () => {
    try {
      // Filter for requests from the selected month and year
      const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59);
      
      const { data, error } = await supabase
        .from('pickup_requests')
        .select('*')
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', endOfMonth.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setRequests(data || []);
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

  const approveRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('pickup_requests')
        .update({ status: 'scheduled' })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Request approved successfully",
      });
      
      fetchAllRequests();
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: "Error",
        description: "Failed to approve request",
        variant: "destructive"
      });
    }
  };

  const deleteRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('pickup_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Request deleted successfully",
      });
      
      fetchAllRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      toast({
        title: "Error",
        description: "Failed to delete request",
        variant: "destructive"
      });
    }
  };

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

    const colors = {
      requested: 'bg-yellow-100 text-yellow-800',
      scheduled: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      delayed: 'bg-red-100 text-red-800'
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
        <h1 className="text-3xl font-bold text-foreground mb-2">All Pickup Requests</h1>
        <p className="text-muted-foreground">
          View all waste pickup requests submitted to KEPA
        </p>
      </div>

      {/* Date Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Filter by month:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "MMMM yyyy") : "Pick a month"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid gap-6">
        {requests.length === 0 ? (
          <Card className="p-8">
            <div className="text-center">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No requests yet</h3>
              <p className="text-muted-foreground">Pickup requests will appear here when submitted.</p>
            </div>
          </Card>
        ) : (
          requests.map((request) => (
            <Card key={request.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      Request #{request.id.slice(0, 8)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {request.user_id ? 'Registered User' : 'Anonymous Request'}
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
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary mt-0.5" />
                      <span className="font-medium">Address:</span>
                      <span className="flex-1">{request.pickup_address}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="h-4 w-4 text-primary" />
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

                {/* Contact Information */}
                {(request.contact_phone || request.contact_email) && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-sm mb-2">Contact Information:</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {request.contact_phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-primary" />
                          <span>{request.contact_phone}</span>
                        </div>
                      )}
                      {request.contact_email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-primary" />
                          <span>{request.contact_email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {request.notes && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-1">Notes:</p>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">{request.notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="border-t pt-4">
                  <div className="flex flex-wrap gap-2">
                    {(request.contact_phone || request.contact_email) && (
                      <div className="flex gap-2">
                        {request.contact_phone && (
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                          >
                            <a href={`tel:${request.contact_phone}`} className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              Call
                            </a>
                          </Button>
                        )}
                        {request.contact_email && (
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                          >
                            <a href={`mailto:${request.contact_email}`} className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              Email
                            </a>
                          </Button>
                        )}
                      </div>
                    )}
                    
                    {request.status === 'requested' && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => approveRequest(request.id)}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteRequest(request.id)}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default UserRequestsPage;