import { useState, useEffect } from "react";
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
import { secureNameSchema } from "@/lib/security";

const userEditSchema = z.object({
  firstName: secureNameSchema,
  lastName: secureNameSchema,
  role: z.enum(["customer", "admin"], { message: "Invalid role selected" })
});

interface UserEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
  user: any;
}

export function UserEditDialog({ open, onOpenChange, onUserUpdated, user }: UserEditDialogProps) {
  const { user: currentUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "customer" as "customer" | "admin"
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && open) {
      setFormData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        role: user.user_roles?.[0]?.role || "customer"
      });
      setValidationErrors({});
    }
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors({});

    try {
      const validationResult = userEditSchema.safeParse(formData);
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

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("Authentication required");
        return;
      }

      const validatedData = validationResult.data;

      const response = await fetch(`https://nncfvsjppvsodpqtcopc.supabase.co/functions/v1/admin-edit-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.session.access_token}`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uY2Z2c2pwcHZzb2RwcXRjb3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NzE5OTEsImV4cCI6MjA3NDM0Nzk5MX0.RLKGrp7zLvt_9DAHhkW5WT9TnAmI_QP7Bhe9Np83rFw'
        },
        body: JSON.stringify({
          userId: user.id,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          role: validatedData.role
        })
      });

      const result = await response.json();

      if (!result.success) {
        toast.error(`Failed to update user: ${result.error}`);
        return;
      }

      toast.success("User updated successfully");
      
      console.info(`SECURITY AUDIT: User updated - ID: ${user.id}, Updated by: ${currentUser?.email}`);
      
      onUserUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and role.
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
            <Label htmlFor="role">Role</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value: "customer" | "admin") => setFormData(prev => ({ ...prev, role: value }))}
              disabled={user.id === currentUser?.id}
            >
              <SelectTrigger className={validationErrors.role ? "border-red-500" : ""}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Standard User</SelectItem>
                <SelectItem value="admin">Admin User</SelectItem>
              </SelectContent>
            </Select>
            {user.id === currentUser?.id && (
              <p className="text-xs text-muted-foreground">You cannot change your own role</p>
            )}
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
                  Updating...
                </>
              ) : (
                "Update User"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}