import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import {
  User,
  Mail,
  Calendar,
  Edit2,
  Check,
  X,
  Upload,
  Trash2,
  Trophy,
  Flame,
  Star
} from 'lucide-react';
import { toast } from 'sonner';

interface ProfileViewProps {
  userEmail: string;
  userName: string;
  onUpdateProfile: (name: string) => void;
}

export function ProfileView({
  userEmail,
  userName,
  onUpdateProfile
}: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userName);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const savedAvatar = localStorage.getItem('user_avatar');
    if (savedAvatar) setAvatarUrl(savedAvatar);

    const loggedInUser = localStorage.getItem('logged_in_user');
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      setEditedName(user.name || userName);
    }
  }, [userName]);

  const initials = editedName
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSave = () => {
    if (!editedName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    onUpdateProfile(editedName);

    const raw = localStorage.getItem('logged_in_user');
    if (raw) {
      const user = JSON.parse(raw);
      user.name = editedName;
      localStorage.setItem('logged_in_user', JSON.stringify(user));
    }

    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleCancel = () => {
    setEditedName(userName);
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setAvatarUrl(base64);
      localStorage.setItem('user_avatar', base64);
      toast.success('Avatar updated');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
    localStorage.removeItem('user_avatar');
    toast.success('Profile photo removed');
  };

  const joinedDate =
    localStorage.getItem('user_joined_date') || new Date().toISOString();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Profile</h1>
        <p className="text-muted-foreground">
          Manage your information and achievements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PROFILE INFO */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Edit your profile details</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt={editedName} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-xl">
                        {initials}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  {/* Upload */}
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-indigo-700"
                  >
                    <Upload className="w-4 h-4" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                <div>
                  <h3 className="font-medium">{editedName}</h3>
                  <p className="text-sm text-muted-foreground">{userEmail}</p>

                  {/* REMOVE PHOTO OPTION */}
                  {avatarUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveAvatar}
                      className="mt-2 text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove photo
                    </Button>
                  )}
                </div>
              </div>

              <Separator />

              {/* NAME */}
              <div className="grid gap-2">
                <Label className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>

                <div className="flex gap-2">
                  <Input
                    value={editedName}
                    onChange={e => setEditedName(e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-muted' : ''}
                  />

                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleSave}
                        className="text-green-600"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCancel}
                        className="text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* EMAIL */}
              <div className="grid gap-2">
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input value={userEmail} disabled className="bg-muted" />
              </div>

              {/* MEMBER SINCE */}
              <div className="grid gap-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Member Since
                </Label>
                <Input
                  value={new Date(joinedDate).toLocaleDateString()}
                  disabled
                  className="bg-muted"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ACHIEVEMENTS */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Your milestones</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Trophy className="text-yellow-500" />
                <div>
                  <p className="font-medium">First Skill Completed</p>
                  <p className="text-xs text-muted-foreground">
                    Completed your first lesson
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Flame className="text-orange-500" />
                <div>
                  <p className="font-medium">7 Day Streak</p>
                  <p className="text-xs text-muted-foreground">
                    Practiced consistently for a week
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Star className="text-indigo-500" />
                <div>
                  <p className="font-medium">Rising Learner</p>
                  <p className="text-xs text-muted-foreground">
                    Completed 5 skills
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
