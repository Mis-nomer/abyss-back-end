import { Model, Schema, model } from 'mongoose';

const MessageSchema = new Schema(
  {
    content: { type: String, required: true },
    flags: { type: [String], default: 'text' },
    is_delivered: { type: Boolean, default: false },
    sent_by: { type: Schema.Types.ObjectId, ref: 'User' },
    room: { type: Schema.Types.ObjectId, ref: 'Room' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export default model('Message', MessageSchema);
