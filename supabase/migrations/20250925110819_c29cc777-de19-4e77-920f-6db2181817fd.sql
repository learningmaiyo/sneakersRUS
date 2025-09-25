-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type TEXT,
  p_user_id UUID DEFAULT auth.uid(),
  p_event_details JSONB DEFAULT '{}'::jsonb
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.security_audit_log (
    event_type,
    user_id,
    user_email,
    event_details,
    created_at
  ) VALUES (
    p_event_type,
    p_user_id,
    COALESCE((SELECT email FROM auth.users WHERE id = p_user_id), 'unknown'),
    p_event_details,
    now()
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;