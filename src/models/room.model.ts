import { RoomTypeEnum } from '@common/enums';
import { IRoom } from '@common/interfaces';
import { Model, Schema, model } from 'mongoose';

const RoomSchema = new Schema<IRoom, Model<IRoom>>(
  {
    name: { type: String, trim: true, maxlength: 100 },
    room_key: {
      type: String,
      required: function () {
        return this.private;
      },
    },
    type: { type: String, enum: RoomTypeEnum, required: true, default: RoomTypeEnum.TEMP },
    private: { type: Boolean, required: true, default: true },

    burn: { type: Boolean, required: true },
    users: { type: [String] },
    whitelist: { type: Boolean, required: true, default: true },
    max_users: { type: Number, default: 2 },
    created_by: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    sessions: { type: [Date] },

    burn_at: {
      type: Date,
      required: function () {
        return this.burn && !this.burn_after;
      },
    },
    burn_after: {
      type: Number,
      required: function () {
        return this.burn && !this.burn_at;
      },
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// RoomSchema.index(
//   { created_at: 1 },
//   {
//     expires: '$burn_after',
//     partialFilterExpression: {
//       burn: true,
//       $expr: { $eq: [{ $size: '$sessions' }, '$burn_after'] },
//     },
//   }
// );

const RoomModel = model('Room', RoomSchema);

export default RoomModel;
