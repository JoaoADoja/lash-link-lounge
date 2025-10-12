-- Fix PUBLIC_DATA_EXPOSURE: Restrict professionals to their own appointments

-- Add professional_id column to appointments table
ALTER TABLE appointments 
ADD COLUMN professional_id uuid REFERENCES auth.users(id);

-- For existing appointments without professional_id, restrict access requires professional_id to be set
-- New appointments must have professional_id assigned

-- Drop existing overly-permissive policies
DROP POLICY IF EXISTS "Professionals can view all appointments" ON appointments;
DROP POLICY IF EXISTS "Professionals can update all appointments" ON appointments;

-- Create restricted policies that check professional_id
CREATE POLICY "Professionals can view their own appointments"
ON appointments FOR SELECT
USING (
  has_role(auth.uid(), 'professional'::app_role) 
  AND professional_id = auth.uid()
);

CREATE POLICY "Professionals can update their own appointments"
ON appointments FOR UPDATE
USING (
  has_role(auth.uid(), 'professional'::app_role) 
  AND professional_id = auth.uid()
);

-- Add index for better query performance
CREATE INDEX idx_appointments_professional_id ON appointments(professional_id);