-- Allow authenticated users to view professionals for booking appointments
CREATE POLICY "Anyone can view professionals"
ON public.user_roles
FOR SELECT
TO authenticated
USING (role = 'professional');