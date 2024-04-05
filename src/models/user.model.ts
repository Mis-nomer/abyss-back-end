import { IUser } from '@common/interfaces';
import { Model, Schema, model } from 'mongoose';

const UserSchema = new Schema<IUser, Model<IUser>>({
  uuid: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },

  email: { type: String, unique: true },

  is_verified: { type: Boolean, default: false, expires: 10 },
  is_blacklisted: { type: Boolean, default: false },
});

// UserSchema.index(
//   { createdAt: 1 },
//   {
//     expires: 10,
//     partialFilterExpression: {
//       is_verified: false,
//     },
//   }
// );

export default model('User', UserSchema);
