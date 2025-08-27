-- Allow anonymous users to submit pickup requests
-- Make user_id nullable to support anonymous requests
ALTER TABLE public.pickup_requests 
ALTER COLUMN user_id DROP NOT NULL;

-- Update the RLS policy to allow anonymous requests
DROP POLICY IF EXISTS "Users can create own requests" ON public.pickup_requests;

-- New policy that allows both authenticated and anonymous users to create requests
CREATE POLICY "Anyone can create pickup requests" 
ON public.pickup_requests 
FOR INSERT 
WITH CHECK (
  -- If user is authenticated, user_id must match auth.uid()
  -- If user is not authenticated, user_id can be null
  (auth.uid() IS NULL AND user_id IS NULL) OR 
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
);

-- Update the select policy to allow users to see their own requests and anonymous requests
DROP POLICY IF EXISTS "Users can view own requests" ON public.pickup_requests;

CREATE POLICY "Users can view own requests" 
ON public.pickup_requests 
FOR SELECT 
USING (
  -- Authenticated users can see their own requests
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  -- Anonymous requests are not viewable by regular users (only staff can see them via their policy)
  false
);

-- Update the update policy to handle anonymous requests
DROP POLICY IF EXISTS "Users can update own requests" ON public.pickup_requests;

CREATE POLICY "Users can update own requests" 
ON public.pickup_requests 
FOR UPDATE 
USING (
  -- Only authenticated users can update their own requests, and only if status is 'requested'
  (auth.uid() IS NOT NULL AND auth.uid() = user_id AND status = 'requested'::pickup_status)
);