import { NextFunction, Response } from 'express';
import { MyRequest } from '../utils/request';
export default (req: MyRequest, res: Response, next: NextFunction) => {
  const name = req.body.name;
  const description = req.body.description;
  if (!name || !description) {
    const field = name ? 'description' : 'name';
    return res.status(400).json({
      error: { field, message: `${field} was not specified` },
    });
  }
  return next();
};
