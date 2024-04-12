import { IRoom } from '@common/interfaces';
import { HTTP_CODE, HTTP_ERROR, HTTP_MESSAGE, HTTP_RESPONSE } from '@common/types';
import RoomModel from '@models/room.model';
import UserModel from '@models/user.model';

type IRoomSubmit = Pick<
  IRoom,
  'room_name' | 'room_burn' | 'room_key' | 'burn_date' | 'burn_after' | 'room_created_by'
>;

export default {
  create: async (data: IRoomSubmit): Promise<HTTP_RESPONSE> => {
    const newRoom = new RoomModel(data);
    const validationResult = newRoom.validateSync();

    // Data validation
    if (validationResult?.errors) {
      throw new HTTP_ERROR('CREATE_FAIL', validationResult?.message);
    }
    // Unverified user limit
    const user = await UserModel.findById(data.room_created_by);

    if (!user) {
      // Register temp user here
    }
    if (user && !user.is_verified) {
      const count = await RoomModel.countDocuments({ room_created_by: user._id });

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
      code: HTTP_CODE.ROOM_CREATED,
      message: HTTP_MESSAGE.CREATE_SUCCESS,
    };
  },
};
