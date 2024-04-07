import { IUser } from '@common/interfaces';
import { HTTP_CODE, HTTP_ERROR, HTTP_MESSAGE, HTTP_RESPONSE, HTTP_STATUS } from '@common/types';
import UserModel from '@models/user.model';

export default {
  create: async (data: Partial<IUser>): Promise<HTTP_RESPONSE> => {
    if (data.username) {
      data.uuid = data.username.valueOf();
    }

    const newUser = new UserModel(data);

    // Duplicate Check
    const isFound = await UserModel.findOne({
      uuid: data.uuid,
    });

    if (isFound) {
      throw new HTTP_ERROR('DUPLICATE');
    }

    const result = await newUser.save();

    if (!result) {
      throw new HTTP_ERROR('INTERNAL_SERVER_ERROR');
    }

    return {
      code: HTTP_CODE.REGISTER_SUCCESS,
      message: HTTP_MESSAGE.CREATE_SUCCESS,
    };
  },
  routineDelete: async () => {
    return await UserModel.deleteMany({ is_verified: false });
  },
};
