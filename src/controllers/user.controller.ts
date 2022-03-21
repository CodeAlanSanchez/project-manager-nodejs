import { convertToSafeUser } from './../utils/converters';
import { MyRequest } from './../utils/request';
import { Response } from 'express';
import { PrismaClient, User } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

// Returns all users
export const users = async (req: MyRequest, res: Response) => {
  // const users = await prisma.user.findMany();
  return res.status(403).json({
    error: {
      field: 'authorization',
      message: 'you are not authorized to do this action',
    },
  });
};

// Returns user's public profile
export const user = async (req: MyRequest, res: Response) => {
  return res.status(403).json({
    error: {
      field: 'authorization',
      message: 'you are not authorized to do this action',
    },
  });
};

// Returns cookie and user info (id, username, email)
export const login = async (req: MyRequest, res: Response) => {
  const { password, identifier } = req.body;

  const user = await prisma.user.findFirst({
    where: { OR: [{ username: identifier }, { email: identifier }] },
  });

  if (!user) {
    return res
      .status(404)
      .json({ field: 'identifier', message: 'user does not exist' });
  }

  const verifyPassword = await argon2.verify(user.password, password);

  if (!verifyPassword) {
    return res
      .status(400)
      .json({ field: 'password', message: 'password is incorrect' });
  }

  req.session.userId = user.id;

  return res.status(200).json(convertToSafeUser(user));
};

// Returns cookie and creates new user
export const register = async (req: MyRequest, res: Response) => {
  const { username, email, password } = req.body;

  const encryptedPassword = await argon2.hash(password);

  const user = await prisma.user.create({
    data: { username, email, password: encryptedPassword },
  });

  if (!user) {
    return res
      .status(400)
      .json({ error: { field: 'all', message: 'User could not be created' } });
  }

  req.session.userId = user.id;

  return res.status(201).json(convertToSafeUser(user));
};

// Updates user info (email, username)
export const updateUser = async (req: MyRequest, res: Response) => {};

// Delete user info
export const deleteUser = async (req: MyRequest, res: Response) => {};

export const me = async (req: MyRequest, res: Response) => {
  if (!req.session.userId) {
    return res.status(401).json({
      error: {
        field: 'authentication',
        message: 'You are not authenticated',
      },
    });
  }

  const user = await prisma.user.findFirst({
    where: { id: req.session.userId },
  });

  if (!user) {
    return res.status(500).json({
      error: {
        field: 'server',
        message: 'Something went wrong, please contact support',
      },
    });
  }

  return res.status(200).json(convertToSafeUser(user!));
};
