import { ObjectId } from 'mongoose';

import { MessageFlagENum, RoomTypeEnum } from './enums';

export interface IRoom {
  _id: ObjectId;

  name: string;
  room_key?: string;
  type: RoomTypeEnum;
  private: boolean;

  burn: boolean;
  users: string[];
  whitelist: boolean;

  created_by: ObjectId;
  created_at: Date;
  sessions: Date[];
  max_users: Number;

  burn_at?: Date;
  burn_after?: number;
}

export interface IUser {
  _id: ObjectId;

  fingerprint: string;
  username: string;
  password: string;
  email?: string;

  is_verified: boolean;
  is_blacklisted: boolean;
  is_admin: boolean;

  created_at: Date;
  delete_at: Date;
}

export interface IMessage {
  _id: ObjectId;
  content: string;
  flags: MessageFlagENum[];
  is_delivered: boolean;
  sent_by: ObjectId;
  room: ObjectId;
  created_at: Date;
}
