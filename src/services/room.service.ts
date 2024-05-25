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
      roomData.burn_at = DateTime.now().plus({ days: 1 }).toJSDate();
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
  get: async (id: string) => {
    const room = await roomModel.findById(id);

    if (!room) throw new HTTP_ERROR('NOT_FOUND');

    return {
      code: HTTP_CODE.SUCCESS,
      message: HTTP_MESSAGE.SUCCESS,
      data: room,
    };
  },
  routineDelete: async () => {
    return await roomModel.deleteMany({
      $or: [{ burn_at: { $lte: DateTime.now().toJSDate() } }, { burn_after: { $gte: 3 } }],
    });
  },
};
