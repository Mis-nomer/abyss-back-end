import { IUser } from '@common/interfaces';
import { HTTP_CODE, HTTP_MESSAGE, HTTP_RESPONSE } from '@common/types';
import hash from '@libs/hash';
import UserModel from '@models/user.model';

export default {
  create: async (data: Partial<IUser>): Promise<HTTP_RESPONSE> => {
    if (data.username) {
      data.uuid = hash(data.username.valueOf());
    }

    const newUser = new UserModel(data);
    const validateResult = newUser.validateSync();

    // Data Validation
    if (validateResult?.errors) {
      return {
        code: HTTP_CODE.AUTH.REGISTER_FAIL,
        message: validateResult?.message,
      };
    }

    // Duplicate Check
    const isFound = await UserModel.findOne({
      uuid: data.uuid,
    });

    if (isFound) {
      return {
        code: HTTP_CODE.AUTH.ALREADY_EXIST,
        message: HTTP_MESSAGE.AUTH.ALREADY_EXIST,
      };
    }

    const result = await newUser.save();

    if (!result) {
      return {
        code: HTTP_CODE.INTERNAL_SERVER_ERROR,
        message: HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      code: HTTP_CODE.AUTH.REGISTER_SUCCESS,
      message: HTTP_MESSAGE.CREATE_SUCCESS,
    };
  },
  routineDelete: async () => {
    return await UserModel.deleteMany({ is_verified: false });
  },
};
