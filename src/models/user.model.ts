import { IUser } from '@common/interfaces';
import { Model, Schema, model } from 'mongoose';

const UserSchema = new Schema<IUser, Model<IUser>>({
  fingerprint: { type: String, required: true, unique: true },

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

  is_admin: { type: Boolean, default: false },

  created_at: { type: Date, default: Date.now },

  delete_at: { type: Date, expires: '24h' },
});

export default model('User', UserSchema);
