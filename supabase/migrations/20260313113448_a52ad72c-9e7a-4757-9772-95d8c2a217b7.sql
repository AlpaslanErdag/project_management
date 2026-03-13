
CREATE TABLE public.reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage reminders" ON public.reminders
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own reminders" ON public.reminders
  FOR SELECT TO authenticated
  USING (
    (target_type = 'user' AND target_id = auth.uid())
    OR (target_type = 'team' AND target_id = get_user_team_id(auth.uid()))
  );

CREATE POLICY "Users can update own reminders" ON public.reminders
  FOR UPDATE TO authenticated
  USING (
    (target_type = 'user' AND target_id = auth.uid())
    OR (target_type = 'team' AND target_id = get_user_team_id(auth.uid()))
  );

CREATE OR REPLACE FUNCTION public.create_validation_trigger_for_reminders()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.target_type NOT IN ('team', 'user') THEN
    RAISE EXCEPTION 'target_type must be team or user';
  END IF;
  RETURN NEW;
END;
$function$;

CREATE TRIGGER validate_reminder_target_type
  BEFORE INSERT OR UPDATE ON public.reminders
  FOR EACH ROW
  EXECUTE FUNCTION public.create_validation_trigger_for_reminders();
