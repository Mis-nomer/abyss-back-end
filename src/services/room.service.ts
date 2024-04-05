import { IRoom } from '@common/interfaces';
import { HTTP_CODE, HTTP_MESSAGE, HTTP_RESPONSE, HTTP_STATUS } from '@common/types';
import RoomModel from '@models/room.model';
import UserModel from '@models/user.model';

export default {
  create: async (data: Partial<IRoom>): Promise<HTTP_RESPONSE> => {
    const newRoom = new RoomModel(data);
    const validateResult = newRoom.validateSync();

    // Data Validation
    if (validateResult?.errors) {
      return {
        code: HTTP_CODE.ROOM.CREATE_FAIL,
        message: validateResult?.message,
      };
    }

    // Unverified User Limit
    const user = await UserModel.findById(data.room_created_by);

    if (user && !user.is_verified) {
      const count = await RoomModel.countDocuments({ room_created_by: user._id });

      if (count >= 3) {
        return {
          code: HTTP_CODE.ROOM.RESTRICT_NOT_VERIFIED,
          message: HTTP_MESSAGE.ROOM.RESTRICT_NOT_VERIFIED,
        };
      }
    }

    // Server Query Check
    const saveResult = await newRoom.save();

    if (!saveResult) {
      return {
        code: HTTP_CODE.ROOM.CREATE_FAIL,
        message: HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      code: HTTP_CODE.ROOM.CREATE_SUCCESS,
      message: HTTP_MESSAGE.CREATE_SUCCESS,
    };
  },
};
