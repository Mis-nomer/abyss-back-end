import { ObjectId } from 'mongoose';

import { MessageFlagEnum, RoomTypeEnum } from './enums';

export interface IRootSchema {
  _id: ObjectId;
  created_at: Date;
  updated_at: Date;
}

export interface IRoom extends IRootSchema {
  name: string;
  room_key?: string;
  type: RoomTypeEnum;
  private: boolean;

  burn: boolean;
  whitelist: boolean;

  created_by: string | ObjectId;
  sessions: Date[];
  max_users: Number;

  burn_at?: Date;
  burn_after?: number;
}

export interface IUser extends IRootSchema {
  fingerprint: string;
  username: string;
  password: string;
  email?: string;

  is_verified: boolean;
  is_blacklisted: boolean;
  is_admin: boolean;

  rooms: string | ObjectId[];

  deleted_at: Date;
}

export interface IMessage extends IRootSchema {
  content: string;
  flags: MessageFlagEnum[];
  is_delivered: boolean;
  sent_by: string | ObjectId;
  room: string | ObjectId;
}
