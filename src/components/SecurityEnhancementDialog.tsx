import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, CheckCircle, AlertTriangle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SecurityEnhancementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SecurityEnhancementDialog({ open, onOpenChange }: SecurityEnhancementDialogProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleCheckItem = (item: string) => {
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const securityImprovements = [
    {
      title: "Enhanced Input Validation",
      description: "All user inputs now use comprehensive Zod validation with security checks",
      status: "completed",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />
    },
    {
      title: "Admin Action Audit Logging",
      description: "All admin actions are now logged for security monitoring",
      status: "completed",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />
    },
    {
      title: "Rate Limiting Protection",
      description: "Client-side rate limiting prevents abuse of admin functions",
      status: "completed",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />
    },
    {
      title: "Role Verification",
      description: "Enhanced role checks prevent privilege escalation",
      status: "completed",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />
    }
  ];

  const manualTasks = [
    {
      id: "leaked-password",
      title: "Enable Leaked Password Protection",
      description: "Configure Supabase to prevent users from using compromised passwords",
      action: "Go to Supabase Dashboard → Authentication → Settings",
      priority: "high"
    },
    {
      id: "email-verification", 
      title: "Configure Email Verification",
      description: "Ensure email verification is properly configured for production",
      action: "Go to Supabase Dashboard → Authentication → Settings",
      priority: "medium"
    },
    {
      id: "session-timeout",
      title: "Set Session Timeout",
      description: "Configure appropriate session timeout for your security needs",
      action: "Go to Supabase Dashboard → Authentication → Settings",
      priority: "medium"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-600" />
            Security Enhancements Applied
          </DialogTitle>
          <DialogDescription>
            Your application has been enhanced with comprehensive security improvements.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Completed Improvements */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-600">✅ Completed Improvements</h3>
            <div className="grid gap-3">
              {securityImprovements.map((improvement, index) => (
                <Card key={index} className="border-green-200 bg-green-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {improvement.icon}
                      <div className="flex-1">
                        <h4 className="font-medium">{improvement.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {improvement.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Manual Tasks */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-600">⚠️ Manual Configuration Required</h3>
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Action Required</AlertTitle>
              <AlertDescription>
                The following security settings require manual configuration in your Supabase dashboard.
              </AlertDescription>
            </Alert>

            <div className="grid gap-3">
              {manualTasks.map((task) => (
                <Card key={task.id} className="border-orange-200 bg-orange-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{task.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded ${
                            task.priority === 'high' 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {task.priority} priority
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 mb-2">
                          {task.description}
                        </p>
                        <p className="text-sm font-medium text-blue-600">
                          {task.action}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleCheckItem(task.id)}
                          className={checkedItems[task.id] ? "text-green-600" : ""}
                        >
                          {checkedItems[task.id] ? <CheckCircle className="h-4 w-4" /> : "Mark Complete"}
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a 
                            href={`https://supabase.com/dashboard/project/${process.env.REACT_APP_SUPABASE_PROJECT_ID || 'nncfvsjppvsodpqtcopc'}/auth/providers`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                          >
                            Open Dashboard
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Security Best Practices */}
          <div>
            <h3 className="text-lg font-semibold mb-4">🔒 Security Features Now Active</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Input Validation</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Email format and injection prevention</li>
                  <li>• Strong password requirements (8+ chars, mixed case, numbers)</li>
                  <li>• Name validation with character restrictions</li>
                  <li>• HTML/script tag sanitization</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Admin Security</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Rate limiting (10 actions per 5 minutes)</li>
                  <li>• Comprehensive audit logging</li>
                  <li>• Role verification for sensitive operations</li>
                  <li>• Self-deletion prevention</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)}>
              Got it, thanks!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}