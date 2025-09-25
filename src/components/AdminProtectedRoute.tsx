import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminProtectedRouteProps {
  children: ReactNode;
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      // Redirect non-admin users to home
      navigate('/', { replace: true });
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <Card className="w-96 glass">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent mb-4" />
            <h2 className="text-lg font-semibold mb-2">Verifying Access</h2>
            <p className="text-muted-foreground text-center">
              Checking your admin privileges...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <Card className="w-96 glass">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShieldAlert className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground text-center mb-6">
              You don't have permission to access the admin dashboard.
            </p>
            <Button onClick={() => navigate('/')} className="btn-glow">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}