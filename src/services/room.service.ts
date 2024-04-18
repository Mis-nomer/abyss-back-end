import { IRoom } from '@common/interfaces';
import { HTTP_CODE, HTTP_ERROR, HTTP_MESSAGE, HTTP_RESPONSE } from '@common/types';
import RoomModel from '@models/room.model';

import userService from './user.service';

interface IRoomSubmit extends Pick<IRoom, 'name' | 'burn' | 'room_key' | 'burn_at' | 'burn_after'> {
  created_by: string;
}

export default {
  create: async (data: IRoomSubmit): Promise<HTTP_RESPONSE> => {
    const newRoom = new RoomModel(data);
    const validationResult = newRoom.validateSync();

    // Data validation
    if (validationResult?.errors) {
      throw new HTTP_ERROR('CREATE_FAIL', validationResult?.message);
    }
    // Unverified user limit
    const user = await userService.findOne(data.created_by);

    if (!user)
      throw new HTTP_ERROR(
        'FORBIDDEN',
        'Unrecognized user, please register or set your username if this is your first time joining!'
      );

    if (user && !user.is_verified) {
      const count = await RoomModel.countDocuments({ created_by: user._id });

      if (count >= 3) {
        throw new HTTP_ERROR('RESTRICT_NOT_VERIFIED', HTTP_MESSAGE.ROOM.RESTRICT_NOT_VERIFIED);
      }
    }

    // Server Query Check
    const saveResult = await newRoom.save();

    if (!saveResult) {
      throw new HTTP_ERROR('INTERNAL_SERVER_ERROR');
    }

    return {
      code: HTTP_CODE.CREATED,
      message: HTTP_MESSAGE.CREATE_SUCCESS,
    };
  },
};
