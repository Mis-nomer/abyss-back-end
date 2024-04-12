import { ObjectId } from 'mongoose';

import { RoomTypeEnum } from './enums';

export interface IRoom {
  _id: ObjectId;

  room_name: string;
  room_key?: string;
  room_type: RoomTypeEnum;
  room_private: boolean;

  room_burn: boolean;
  room_occupants: (ObjectId | string)[];
  room_whitelist: boolean;

  room_created_by: ObjectId | string;
  room_sessions: Date[];

  burn_date?: Date;
  burn_after?: number;
}

export interface IUser {
  _id: ObjectId;

  uuid: string;
  username: string;
  password: string;
  email?: string;

  is_verified: boolean;
  is_blacklisted: boolean;

  createdAt: Date;
}
