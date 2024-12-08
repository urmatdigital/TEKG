import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  clientCode: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  telegramUsername: z.string().optional(),
  telegramPhotoUrl: z.string().url().optional(),
  balance: z.number().default(0),
  referralBalance: z.number().default(0),
  cashbackBalance: z.number().default(0),
  isVerified: z.boolean().default(false),
  isAdmin: z.boolean().default(false)
});

export const AuthContextSchema = z.object({
  user: UserSchema.nullable(),
  token: z.string().nullable(),
  isAuthenticated: z.boolean(),
  login: z.function()
    .args(UserSchema, z.string())
    .returns(z.void()),
  logout: z.function()
    .args()
    .returns(z.void())
});

export type User = z.infer<typeof UserSchema>;
export type AuthContextType = z.infer<typeof AuthContextSchema>;
