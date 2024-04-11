import { IUser } from '@common/interfaces';
import { HTTP_CODE, HTTP_ERROR, HTTP_MESSAGE, HTTP_RESPONSE, HTTP_STATUS } from '@common/types';
import userModel from '@models/user.model';

export default {
  create: async (data: Partial<IUser>): Promise<HTTP_RESPONSE> => {
    if (data.username) {
      data.uuid = data.username.valueOf();
    }

    const newUser = new userModel(data);

    // Duplicate Check
    const isFound = await userModel.findOne({
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
      data: result,
      code: HTTP_CODE.REGISTER_SUCCESS,
      message: HTTP_MESSAGE.CREATE_SUCCESS,
    };
  },
  findOne: async (id: string, other?: Record<string, unknown>) => {
    if (id) {
      return await userModel.findById(id);
    } else return await userModel.findOne(other);
  },
  routineDelete: async () => {
    return await userModel.deleteMany({ is_verified: false });
  },
};
