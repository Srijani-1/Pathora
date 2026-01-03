import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { User, Mail, Calendar, LogOut, Edit2, Check, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileViewProps {
  userEmail: string;
  userName: string;
  onLogout: () => void;
  onUpdateProfile: (name: string) => void;
}

export function ProfileView({ userEmail, userName, onLogout, onUpdateProfile }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userName);

  const handleSave = async () => {
    if (!editedName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/users/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ full_name: editedName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Update failed');
      }

      await onUpdateProfile(editedName);
      setIsEditing(false);
      toast.success('Profile updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditedName(userName);
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    toast.warning("Delete your account?", {
      description: "This action is permanent. All your data will be lost.",
      action: {
        label: "Delete Permanently",
        onClick: async () => {
          try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('/api/users/profile', {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            // Status 204 means success with no content. 
            // Do NOT call response.json() here or it will error.
            if (response.status === 204 || response.ok) {
              toast.success('Account deleted successfully');
              onLogout(); // Clears localStorage and redirects
            } else {
              const errorData = await response.json();
              throw new Error(errorData.detail || 'Deletion failed');
            }
          } catch (error: any) {
            toast.error(error.message || 'Failed to delete account');
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => { },
      },
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const joinedDate = localStorage.getItem('user_joined_date') || new Date().toISOString();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-gradient-to-br from-[#4338ca] to-[#7c3aed] text-white text-xl">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{userName}</h3>
              <p className="text-sm text-muted-foreground">{userEmail}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <div className="flex gap-2">
                <Input
                  id="name"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-muted' : ''}
                />
                {!isEditing ? (
                  <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="icon" onClick={handleSave} className="text-green-600">
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleCancel} className="text-red-600">
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="flex items-center gap-2"><Mail className="w-4 h-4" />Email</Label>
              <Input value={userEmail} disabled className="bg-muted" />
            </div>

            <div className="grid gap-2">
              <Label className="flex items-center gap-2"><Calendar className="w-4 h-4" />Joined</Label>
              <Input
                value={new Date(joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                disabled
                className="bg-muted"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>Manage your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" onClick={onLogout} className="flex-1 sm:flex-none">
              <LogOut className="w-4 h-4 mr-2" /> Log Out
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} className="flex-1 sm:flex-none">
              <Trash2 className="w-4 h-4 mr-2" /> Delete Account
            </Button>
          </div>
          <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium">Danger Zone</p>
            <p className="text-xs text-muted-foreground mt-1">
              Deleting your account will remove all data associated with {userEmail}.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
