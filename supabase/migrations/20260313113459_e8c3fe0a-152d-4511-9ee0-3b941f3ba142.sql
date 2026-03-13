
CREATE OR REPLACE FUNCTION public.create_validation_trigger_for_reminders()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.target_type NOT IN ('team', 'user') THEN
    RAISE EXCEPTION 'target_type must be team or user';
  END IF;
  RETURN NEW;
END;
$function$;
