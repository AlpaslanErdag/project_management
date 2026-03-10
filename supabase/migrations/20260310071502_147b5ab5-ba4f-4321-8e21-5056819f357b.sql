CREATE POLICY "Anon can view teams"
ON public.teams FOR SELECT
TO anon
USING (true);