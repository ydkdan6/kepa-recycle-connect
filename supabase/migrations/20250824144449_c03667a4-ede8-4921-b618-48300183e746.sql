-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'field_staff', 'resident');

-- Create app_status enum for pickup statuses
CREATE TYPE public.pickup_status AS ENUM ('requested', 'scheduled', 'in_progress', 'completed', 'delayed');

-- Create waste_type enum
CREATE TYPE public.waste_type AS ENUM ('plastic', 'paper', 'organic', 'electronics', 'glass', 'metal', 'mixed');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}'::jsonb,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'resident',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create pickup_requests table
CREATE TABLE public.pickup_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  waste_type waste_type NOT NULL,
  quantity_kg DECIMAL NOT NULL CHECK (quantity_kg > 0),
  pickup_address TEXT NOT NULL,
  pickup_latitude DECIMAL,
  pickup_longitude DECIMAL,
  preferred_date DATE,
  status pickup_status NOT NULL DEFAULT 'requested',
  notes TEXT,
  photo_url TEXT,
  assigned_vehicle TEXT,
  assigned_staff_id UUID REFERENCES auth.users(id),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaigns table
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  image_url TEXT,
  location TEXT,
  max_participants INTEGER,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaign_participants table
CREATE TABLE public.campaign_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (campaign_id, user_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pickup_reminder', 'status_update', 'campaign_alert', 'general')),
  read BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data JSONB DEFAULT '{}'::jsonb
);

-- Create analytics_summary table for performance
CREATE TABLE public.analytics_summary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  total_requests INTEGER DEFAULT 0,
  completed_requests INTEGER DEFAULT 0,
  total_weight_kg DECIMAL DEFAULT 0,
  co2_saved_kg DECIMAL DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_summary ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = user_uuid LIMIT 1;
$$;

-- Create function to check if user has role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "KEPA staff can view all profiles" ON public.profiles
  FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('admin', 'field_staff')
  );

-- RLS Policies for user_roles
CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for pickup_requests  
CREATE POLICY "Users can view own requests" ON public.pickup_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own requests" ON public.pickup_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own requests" ON public.pickup_requests
  FOR UPDATE USING (auth.uid() = user_id AND status = 'requested');

CREATE POLICY "KEPA staff can view all requests" ON public.pickup_requests
  FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('admin', 'field_staff')
  );

CREATE POLICY "KEPA staff can update requests" ON public.pickup_requests
  FOR UPDATE USING (
    public.get_user_role(auth.uid()) IN ('admin', 'field_staff')
  );

-- RLS Policies for campaigns
CREATE POLICY "Everyone can view active campaigns" ON public.campaigns
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage campaigns" ON public.campaigns
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for campaign_participants
CREATE POLICY "Users can view own participation" ON public.campaign_participants
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can register for campaigns" ON public.campaign_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "KEPA staff can view all participants" ON public.campaign_participants
  FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('admin', 'field_staff')
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for analytics_summary
CREATE POLICY "KEPA staff can view analytics" ON public.analytics_summary
  FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('admin', 'field_staff')
  );

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pickup_requests_updated_at
  BEFORE UPDATE ON public.pickup_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'New User'));
  
  -- Assign default role as resident
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'resident');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for waste photos
INSERT INTO storage.buckets (id, name, public) VALUES ('waste-photos', 'waste-photos', true);

-- Storage policies for waste photos
CREATE POLICY "Users can upload their own waste photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'waste-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own waste photos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'waste-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "KEPA staff can view all waste photos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'waste-photos' AND 
    public.get_user_role(auth.uid()) IN ('admin', 'field_staff')
  );

-- Create storage bucket for campaign materials  
INSERT INTO storage.buckets (id, name, public) VALUES ('campaign-materials', 'campaign-materials', true);

-- Storage policies for campaign materials
CREATE POLICY "Everyone can view campaign materials" ON storage.objects
  FOR SELECT USING (bucket_id = 'campaign-materials');

CREATE POLICY "Admins can upload campaign materials" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'campaign-materials' AND 
    public.has_role(auth.uid(), 'admin')
  );

-- Enable realtime for real-time updates
ALTER publication supabase_realtime ADD TABLE public.pickup_requests;
ALTER publication supabase_realtime ADD TABLE public.notifications;
ALTER publication supabase_realtime ADD TABLE public.campaigns;