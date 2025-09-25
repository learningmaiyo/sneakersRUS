-- Create security audit table for tracking security events
CREATE TABLE public.security_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  event_details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Create policies for security audit log
CREATE POLICY "Super admins can view all audit logs" 
ON public.security_audit_log 
FOR SELECT 
USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins can view limited audit logs" 
ON public.security_audit_log 
FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  AND event_type NOT IN ('admin_privilege_change', 'admin_role_assignment')
);

CREATE POLICY "System can insert audit logs" 
ON public.security_audit_log 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_security_audit_log_event_type ON public.security_audit_log(event_type);
CREATE INDEX idx_security_audit_log_user_id ON public.security_audit_log(user_id);
CREATE INDEX idx_security_audit_log_created_at ON public.security_audit_log(created_at);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_security_audit_log_updated_at
BEFORE UPDATE ON public.security_audit_log
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to log security events from the database
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type TEXT,
  p_user_id UUID DEFAULT auth.uid(),
  p_event_details JSONB DEFAULT '{}'::jsonb
) RETURNS UUID AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;