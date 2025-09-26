import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { secureEmailSchema, secureNameSchema, strongPasswordSchema } from "@/lib/security";

// Security validation schema - using centralized security utilities
const userCreateSchema = z.object({
  email: secureEmailSchema,
  password: strongPasswordSchema,
  firstName: secureNameSchema,
  lastName: secureNameSchema,
  role: z.enum(["customer", "admin"], { message: "Invalid role selected" })
});

interface UserCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: () => void;
}

export function UserCreateDialog({ open, onOpenChange, onUserCreated }: UserCreateDialogProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "customer" as "customer" | "admin"
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors({});

    try {
      // Validate input data
      const validationResult = userCreateSchema.safeParse(formData);
      if (!validationResult.success) {
        const errors: Record<string, string> = {};
        validationResult.error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            errors[issue.path[0] as string] = issue.message;
          }
        });
        setValidationErrors(errors);
        toast.error("Please fix the validation errors");
        return;
      }

      // Security check: Verify current user is admin before creating admin users
      if (formData.role === "admin") {
        const { data: currentUserRole, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user?.id)
          .single();

        if (roleError || !currentUserRole || !['admin', 'super_admin'].includes(currentUserRole.role)) {
          toast.error("Unauthorized: Only admins can create admin users");
          return;
        }

        // Log admin user creation for security audit
        console.warn(`SECURITY AUDIT: Admin user creation attempted by ${user?.email} for ${formData.email}`);
      }

      // Create the user account via Edge Function
      // Use validated data to prevent injection
      const validatedData = validationResult.data;
      
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch(`https://nncfvsjppvsodpqtcopc.supabase.co/functions/v1/admin-create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.session.access_token}`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uY2Z2c2pwcHZzb2RwcXRjb3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NzE5OTEsImV4cCI6MjA3NDM0Nzk5MX0.RLKGrp7zLvt_9DAHhkW5WT9TnAmI_QP7Bhe9Np83rFw'
        },
        body: JSON.stringify({
          email: validatedData.email,
          password: validatedData.password,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          role: validatedData.role
        })
      });

      const result = await response.json();

      if (!result.success) {
        toast.error(`Failed to create user: ${result.error}`);
        return;
      }

      toast.success(`User created successfully with ${validatedData.role} role`);
      
      // Security audit log
      console.info(`SECURITY AUDIT: User created - Email: ${validatedData.email}, Role: ${validatedData.role}, Created by: ${user?.email}`);
      
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "customer"
      });
      setValidationErrors({});
      onUserCreated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system with the specified role.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className={validationErrors.firstName ? "border-red-500" : ""}
                required
              />
              {validationErrors.firstName && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className={validationErrors.lastName ? "border-red-500" : ""}
                required
              />
              {validationErrors.lastName && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.lastName}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={validationErrors.email ? "border-red-500" : ""}
              required
            />
            {validationErrors.email && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className={validationErrors.password ? "border-red-500" : ""}
              required
              minLength={8}
            />
            {validationErrors.password && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.password}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Password must be at least 8 characters with uppercase, lowercase, and number
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value: "customer" | "admin") => setFormData(prev => ({ ...prev, role: value }))}>
              <SelectTrigger className={validationErrors.role ? "border-red-500" : ""}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Standard User</SelectItem>
                <SelectItem value="admin">Admin User</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.role && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.role}</p>
            )}
          </div>
          
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create User"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}