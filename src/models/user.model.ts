import { IUser } from '@common/interfaces';
import { Model, Schema, model } from 'mongoose';

const UserSchema = new Schema<IUser, Model<IUser>>(
  {
    fingerprint: { type: String, required: true, unique: true },

    username: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return this.is_verified;
      },
    },
    email: {
      type: String,
    },

    is_verified: { type: Boolean, default: false },

    is_blacklisted: { type: Boolean, default: false },

    is_admin: { type: Boolean, default: false },

    rooms: { type: [Schema.Types.ObjectId], ref: 'room' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

UserSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { is_verified: { $eq: true } } }
);

export default model('User', UserSchema);
