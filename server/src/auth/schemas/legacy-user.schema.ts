import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class LegacyUser extends Document {
  @Prop({ required: true, unique: true })
  clientCode: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  phone: string;
}

export const LegacyUserSchema = SchemaFactory.createForClass(LegacyUser);
