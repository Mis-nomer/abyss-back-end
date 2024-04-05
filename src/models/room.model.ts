import { RoomTypeEnum } from '@common/enums';
import { IRoom } from '@common/interfaces';
import { Model, Schema, model } from 'mongoose';

const RoomSchema = new Schema<IRoom, Model<IRoom>>(
  {
    room_name: { type: String, trim: true, maxlength: 100 },
    room_key: {
      type: String,
      required: function () {
        return Boolean(this.room_private);
      },
    },
    room_type: { type: String, enum: RoomTypeEnum, required: true, default: RoomTypeEnum.PAIR },
    room_private: { type: Boolean, required: true, default: true },

    room_burn: { type: Boolean, required: true },
    room_occupants: { type: [Schema.Types.ObjectId], ref: 'User' },
    room_whitelist: { type: Boolean, required: true, default: true },

    room_created_by: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    room_sessions: { type: [Date] },

    burn_after: {
      type: Number,
      required: function () {
        return Boolean(this.room_burn);
      },
    },
    burn_date: {
      type: Date,
      required: function () {
        return Boolean(this.room_burn);
      },
    },
  },
  {
    timestamps: true,
  }
);

RoomSchema.index(
  { createdAt: 1 },
  {
    expires: 30,
    partialFilterExpression: {
      room_burn: true,
      $expr: { $eq: [{ $size: '$room_sessions' }, '$burn_after'] },
    },
  }
);

RoomSchema.pre('save', async function (next) {
  this.room_occupants.push(this.room_created_by);
  this.room_sessions.push(new Date());

  next();
});

const RoomModel = model('Room', RoomSchema);

export default RoomModel;
