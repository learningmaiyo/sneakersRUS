import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { User, Camera, Save, ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const profileSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  last_name: z.string().trim().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  display_name: z.string().trim().min(1, 'Display name is required').max(100, 'Display name must be less than 100 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  country: z.string().max(100, 'Country must be less than 100 characters').optional(),
  date_of_birth: z.string().optional()
});

export default function Profile() {
  const { user } = useAuth();
  const { profile, loading, updating, updateProfile, uploadAvatar } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Redirect if not authenticated
  if (!user && !loading) {
    navigate('/auth');
    return null;
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, or WebP image",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    await uploadAvatar(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      display_name: formData.get('display_name') as string,
      bio: formData.get('bio') as string || '',
      country: formData.get('country') as string || '',
      date_of_birth: formData.get('date_of_birth') as string || ''
    };

    try {
      const validation = profileSchema.parse(data);
      const result = await updateProfile(validation);
      
      if (result?.success) {
        setIsEditing(false);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.issues[0].message,
          variant: "destructive"
        });
      }
    }
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || '?';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Overview Card */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <div className="relative mx-auto">
                    <Avatar className="h-24 w-24 cursor-pointer transition-opacity hover:opacity-80" onClick={handleAvatarClick}>
                      <AvatarImage src={profile?.avatar_url || ''} alt="Profile" />
                      <AvatarFallback className="text-lg">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-lg"
                      onClick={handleAvatarClick}
                      disabled={updating}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {profile?.display_name || `${profile?.first_name} ${profile?.last_name}` || 'User'}
                    </h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    <Badge variant="secondary">Customer</Badge>
                  </div>
                </CardHeader>
                
                {profile && !isEditing && (
                  <CardContent className="space-y-4">
                    {profile.bio && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Bio</Label>
                        <p className="text-sm mt-1">{profile.bio}</p>
                      </div>
                    )}
                    
                    {profile.country && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.country}</span>
                      </div>
                    )}
                    
                    {profile.date_of_birth && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Born {formatDate(profile.date_of_birth)}</span>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                      <p className="text-sm mt-1">{formatDate(profile.created_at)}</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Manage your account details and preferences
                      </CardDescription>
                    </div>
                    {!isEditing && (
                      <Button onClick={() => setIsEditing(true)} className="gap-2">
                        <User className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first_name">First Name *</Label>
                          <Input
                            id="first_name"
                            name="first_name"
                            defaultValue={profile?.first_name || ''}
                            placeholder="Enter your first name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last_name">Last Name *</Label>
                          <Input
                            id="last_name"
                            name="last_name"
                            defaultValue={profile?.last_name || ''}
                            placeholder="Enter your last name"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="display_name">Display Name *</Label>
                        <Input
                          id="display_name"
                          name="display_name"
                          defaultValue={profile?.display_name || ''}
                          placeholder="How you'd like to be addressed"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          defaultValue={profile?.bio || ''}
                          placeholder="Tell us a bit about yourself"
                          className="min-h-[100px]"
                          maxLength={500}
                        />
                        <p className="text-xs text-muted-foreground">
                          {(profile?.bio?.length || 0)}/500 characters
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            name="country"
                            defaultValue={profile?.country || ''}
                            placeholder="Enter your country"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="date_of_birth">Date of Birth</Label>
                          <Input
                            id="date_of_birth"
                            name="date_of_birth"
                            type="date"
                            defaultValue={profile?.date_of_birth || ''}
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button 
                          type="submit" 
                          disabled={updating}
                          className="gap-2"
                        >
                          <Save className="h-4 w-4" />
                          {updating ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          disabled={updating}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">First Name</Label>
                          <p className="text-lg mt-1">{profile?.first_name || 'Not provided'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Last Name</Label>
                          <p className="text-lg mt-1">{profile?.last_name || 'Not provided'}</p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Display Name</Label>
                        <p className="text-lg mt-1">{profile?.display_name || 'Not provided'}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                        <p className="text-lg mt-1">{user?.email}</p>
                      </div>

                      {profile?.bio && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Bio</Label>
                          <p className="text-lg mt-1 whitespace-pre-wrap">{profile.bio}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Country</Label>
                          <p className="text-lg mt-1">{profile?.country || 'Not provided'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Date of Birth</Label>
                          <p className="text-lg mt-1">
                            {profile?.date_of_birth ? formatDate(profile.date_of_birth) : 'Not provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}