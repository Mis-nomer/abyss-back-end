import { RoomTypeEnum } from '@common/enums';
import { IRoom } from '@common/interfaces';
import { HTTP_CODE, HTTP_ERROR, HTTP_MESSAGE, HTTP_RESPONSE } from '@common/types';
import roomModel from '@models/room.model';
import userModel from '@models/user.model';
import { DateTime } from 'luxon';
import { ObjectId } from 'mongoose';

import userService from './user.service';

interface IRoomSubmit extends Pick<IRoom, 'name' | 'room_key'> {
  created_by: string | ObjectId;
}

export default {
  create: async (data: IRoomSubmit): Promise<HTTP_RESPONSE> => {
    let roomData: Partial<IRoom> = data;
    const user = await userService.findOne(data.created_by);

    //? Deny unknown user
    if (!user)
      throw new HTTP_ERROR(
        'FORBIDDEN',
        'Unrecognized user, please register or set your username if this is your first time joining!'
      );

    //? Enforce limit on unverified user
    if (user && !user.is_verified) {
      const count = await roomModel.countDocuments({ created_by: user._id });

      if (count > 3) {
        throw new HTTP_ERROR('RESTRICT_NOT_VERIFIED', HTTP_MESSAGE.ROOM.RESTRICT_NOT_VERIFIED);
      }

      roomData.burn = true;
      roomData.burn_at = DateTime.now().plus({ minutes: 20 }).toJSDate();
      roomData.max_users = 2;
      roomData.type = RoomTypeEnum.TEMP;
    }

    const newRoom = new roomModel(roomData);
    const validationResult = newRoom.validateSync();

    // Data validation
    if (validationResult?.errors) {
      throw new HTTP_ERROR('CREATE_FAIL', validationResult?.message);
    }

    // Server Query Check
    const saveResult = await newRoom.save();

    if (!saveResult) {
      throw new HTTP_ERROR('INTERNAL_SERVER_ERROR');
    }

    return {
      code: HTTP_CODE.CREATED,
      message: HTTP_MESSAGE.CREATE_SUCCESS,
      data: { _id: saveResult._id, name: saveResult.name },
    };
  },
  join: async (room_id: string, user_id: string) => {
    const room = await roomModel.findById(room_id);
    const user = await userModel.findById(user_id);

    if (!room) throw new HTTP_ERROR('NOT_FOUND', 'Room not found');
    if (!user) throw new HTTP_ERROR('NOT_FOUND', 'User not found');

    if (room.type === RoomTypeEnum.TEMP) {
      if (room.users.length <= 1 && !room.users.includes(user_id)) {
        room.users.push(user_id);
      } else if (room.users.length === 2) {
        room.sessions.push(new Date());
        room.burn_at = DateTime.now().plus({ days: 1 }).toJSDate();
      } else throw new HTTP_ERROR('RESTRICT_MAXIMUM_USER_PER_ROOM');
    }

    await roomModel.findByIdAndUpdate(room_id, room);

    return {
      code: HTTP_CODE.SUCCESS,
      message: 'Room joined',
    };
  },
  routineDelete: async () => {
    return await roomModel.deleteMany({
      $or: [{ burn_at: { $lte: DateTime.now().toJSDate() } }, { burn_after: { $gte: 3 } }],
    });
  },
};
