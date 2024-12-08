import { User } from '../entities/user.entity';

export class AuthResponseDto {
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName?: string;
    role: string;
  };
  access_token: string;
}
