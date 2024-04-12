import { IUser } from '@common/interfaces';
import { Model, Schema, model } from 'mongoose';

const UserSchema = new Schema<IUser, Model<IUser>>({
  uuid: { type: String, required: true, unique: true },

  username: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () {
      return this.is_verified;
    },
  },
  email: { type: String, unique: true },

  is_verified: { type: Boolean, default: false },

  is_blacklisted: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now, expires: '1m' },
});

export default model('User', UserSchema);
