import { IUser } from '@common/interfaces';
import { Model, Schema, Types, model } from 'mongoose';

const UserSchema = new Schema<IUser, Model<IUser>>({
  username: { type: String },

  email: { type: String },
  is_verified: { type: Boolean, default: true },
  is_blacklisted: { type: Boolean, default: true },
});

export default model('User', UserSchema);
