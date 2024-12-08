import { User } from '@/types/auth.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserInfoProps {
  user: User;
  showDetails?: boolean;
}

export function UserInfo({ user, showDetails = true }: UserInfoProps) {
  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.photo_url} alt={user.first_name} />
        <AvatarFallback>{user.first_name?.[0]}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">
          {user.first_name} {user.last_name}
        </div>
        {showDetails && (
          <>
            {user.telegram_username && (
              <div className="text-sm text-gray-500">
                @{user.telegram_username}
              </div>
            )}
            <div className="text-sm text-gray-500">{user.phone}</div>
          </>
        )}
      </div>
    </div>
  );
}
