import { User } from '../entities/user.entity';

export class AuthResponseDto {
  token: string;
  user: {
    id: string;
    telegramId?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
  };
}
