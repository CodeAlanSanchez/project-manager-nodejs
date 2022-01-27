import { NextFunction, Response } from 'express';
import { MyRequest } from './../utils/request';
export default (req: MyRequest, res: Response, next: NextFunction) => {
  try {
    if (req.session?.userId) {
      return next();
    }
    return res.status(401).json({
      error: {
        field: 'authentication',
        message: 'you are not authorized to do this action',
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: {
        field: 'unknown',
        message: 'something went wrong, please contact support',
      },
    });
  }
};
