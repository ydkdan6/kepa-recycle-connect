-- Remove restrictive RLS policies and allow users to view all requests
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own requests" ON public.pickup_requests;
DROP POLICY IF EXISTS "KEPA staff can view all requests" ON public.pickup_requests;

-- Create new permissive policies for viewing requests
CREATE POLICY "Everyone can view all pickup requests" 
ON public.pickup_requests 
FOR SELECT 
USING (true);

-- Keep the insert policy permissive
-- (Already exists: "Anyone can create pickup requests")

-- Keep staff update policy for managing requests
-- (Already exists: "KEPA staff can update requests")

-- Add phone and email columns to pickup_requests table for contact info
ALTER TABLE public.pickup_requests 
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT;