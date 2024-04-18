import { Model, Schema, model } from 'mongoose';

const MessageSchema = new Schema({
  content: { type: String, required: true },
  flags: { type: [String], default: 'text' },
  is_delivered: { type: Boolean, default: false },
  sent_by: { type: Schema.Types.ObjectId, ref: 'User' },
  room: { type: Schema.Types.ObjectId, ref: 'Room' },
  created_at: { type: Date, default: Date.now },
});

export default model('Message', MessageSchema);
