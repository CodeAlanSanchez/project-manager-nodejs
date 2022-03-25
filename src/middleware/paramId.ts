import { MyRequest } from '../utils/request';
import { parseId } from '../utils/parseId';
import { NextFunction, Response } from 'express';
export default (req: MyRequest, res: Response, next: NextFunction) => {
  const id = parseId(req.params.id);

  if (id) return next();

  return res
    .status(400)
    .json({ error: { field: 'id', message: 'invalid id' } });
};
