
CREATE TABLE public.weekly_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  week_start date NOT NULL,
  week_end date NOT NULL,
  report_data jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(team_id, week_start)
);

ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage reports" ON public.weekly_reports
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Team members can view own reports" ON public.weekly_reports
FOR SELECT TO authenticated
USING (team_id = get_user_team_id(auth.uid()));

CREATE POLICY "Team members can insert own reports" ON public.weekly_reports
FOR INSERT TO authenticated
WITH CHECK (team_id = get_user_team_id(auth.uid()));
