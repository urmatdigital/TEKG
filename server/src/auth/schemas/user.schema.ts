import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  clientCode: string;

  @Prop({ unique: true, sparse: true })
  telegramId: number;

  @Prop({ unique: true, sparse: true })
  chatId: number;

  @Prop({ required: true })
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: true, sparse: true })
  phone: string;

  @Prop()
  password: string;

  @Prop()
  telegramUsername: string;

  @Prop()
  telegramPhotoUrl: string;

  @Prop({ required: true, unique: true })
  referralCode: string;

  @Prop({ default: 0 })
  referralBalance: number;

  @Prop({ default: 0 })
  cashbackBalance: number;

  @Prop({ type: String, ref: 'User' })
  referredBy: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
