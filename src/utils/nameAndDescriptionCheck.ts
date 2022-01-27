import { NextFunction, Response } from 'express';

export const nameDescCheck = (name: any, description: any, res: Response) => {
  if (!name || !description) {
    const field = name ? 'description' : 'name';
    return res.status(400).json({
      error: { field, message: `${field} was not specified` },
    });
  }
  return { name, description };
};
