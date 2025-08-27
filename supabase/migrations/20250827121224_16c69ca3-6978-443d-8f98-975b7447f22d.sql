-- Fix RLS policy to properly handle anonymous requests
-- Drop the current policy and create a simpler one
DROP POLICY IF EXISTS "Anyone can create pickup requests" ON public.pickup_requests;

-- Create a policy that allows anyone to insert pickup requests
CREATE POLICY "Anyone can create pickup requests" 
ON public.pickup_requests 
FOR INSERT 
TO public
WITH CHECK (true);

-- Also ensure anonymous users can't view any requests (only staff can see all requests)
DROP POLICY IF EXISTS "Users can view own requests" ON public.pickup_requests;

CREATE POLICY "Users can view own requests" 
ON public.pickup_requests 
FOR SELECT 
USING (
  -- Authenticated users can see their own requests only
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
);