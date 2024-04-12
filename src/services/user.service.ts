import { IUser } from '@common/interfaces';
import { HTTP_CODE, HTTP_ERROR, HTTP_MESSAGE, HTTP_RESPONSE } from '@common/types';
import userModel from '@models/user.model';

type IUserSubmit = Pick<IUser, 'uuid' | 'username'>;

export default {
  create: async (data: IUserSubmit): Promise<HTTP_RESPONSE> => {
    const isFound = await userModel.findOne({
      uuid: data.uuid,
    });

    if (isFound) {
      throw new HTTP_ERROR('DUPLICATE');
    }

    const newUser = new userModel({ ...data, is_blacklisted: false, is_verified: false });

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
