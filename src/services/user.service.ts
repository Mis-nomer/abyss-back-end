import { HTTP_CODE, HTTP_ERROR, HTTP_MESSAGE, HTTP_RESPONSE } from '@common/types';
import userModel from '@models/user.model';
import { ObjectId } from 'mongoose';
import { omit } from 'remeda';

export default {
  create: async (data): Promise<HTTP_RESPONSE> => {
    const isFound = await userModel.findOne({ fingerprint: data.fingerprint });

    if (isFound) {
      throw new HTTP_ERROR('DUPLICATE');
    }

    const newUser = new userModel({ ...data, is_blacklisted: false, is_verified: false });

    const result = await newUser.save();

    if (!result) {
      throw new HTTP_ERROR('INTERNAL_SERVER_ERROR');
    }

    return {
      data: omit(result.toObject(), ['password', 'created_at', '_id']),
      code: HTTP_CODE.REGISTER_SUCCESS,
      message: HTTP_MESSAGE.CREATE_SUCCESS,
    };
  },

  //Default to find by ID if pass in a string
  findOne: async (field: string | ObjectId | Record<string, unknown>) => {
    return typeof field === 'string'
      ? await userModel.findById(field)
      : await userModel.findOne(field);
  },

  routineDelete: async () => {
    return await userModel.deleteMany({ is_verified: false });
  },
};
