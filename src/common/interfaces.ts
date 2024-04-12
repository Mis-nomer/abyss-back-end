import { ObjectId } from 'mongoose';

import { RoomTypeEnum } from './enums';

export interface IRoom {
  _id: ObjectId;

  room_name?: String;
  room_key?: String;
  room_type: RoomTypeEnum;
  room_private: Boolean;

  room_burn: Boolean;
  room_occupants: ObjectId[];
  room_whitelist?: Boolean;

  room_created_by: ObjectId;
  room_sessions: Date[];

  burn_date?: Date;
  burn_after?: Number;
}

export interface IUser {
  _id: ObjectId;

  uuid: String;
  username: String;
  password: String;
  email?: String;

  is_verified: Boolean;
  is_blacklisted: Boolean;
}
