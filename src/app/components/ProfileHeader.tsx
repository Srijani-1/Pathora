import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from './ui/dropdown-menu';
import { User, LogOut } from 'lucide-react';
import { FC } from 'react';

interface ProfileHeaderProps {
  userName: string;
  onLogout: () => void;
}

export const ProfileHeader: FC<ProfileHeaderProps> = ({ userName, onLogout }) => {
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="flex justify-end items-center mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>{getInitials(userName)}</AvatarFallback>
            </Avatar>
            <span className="hidden md:inline">{userName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="w-4 h-4 mr-2" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
