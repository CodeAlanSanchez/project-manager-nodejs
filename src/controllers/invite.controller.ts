import { parseId } from './../utils/parseId';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { MyRequest } from './../utils/request';

const prisma = new PrismaClient();

export const invites = async () => {};

export const invite = async () => {};

export const createInvite = async (req: MyRequest, res: Response) => {
  const projectId = parseId(req.body.senderId);
  const receiverId = parseId(req.body.receiverId);

  if (!projectId) {
    return res
      .status(400)
      .json({ error: { id: 'sender', message: 'invalid id' } });
  }

  if (!receiverId) {
    return res
      .status(400)
      .json({ error: { id: 'receiver', message: 'invalid id' } });
  }

  const invite = await prisma.invite.create({
    data: {
      sender: { connect: { id: req.session.userId } },
      receiver: { connect: { id: receiverId } },
      project: { connect: { id: projectId } },
    },
  });

  if (!invite) {
    return res.status(400).json({
      error: {
        id: 'unknown',
        message: 'something went wrong, please check id values',
      },
    });
  }

  return res.status(201).json({ data: invite });
};

export const updateInvite = async () => {};

export const acceptInvite = async () => {};

export const declineInvite = async () => {};
