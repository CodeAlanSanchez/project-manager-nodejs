import { parseId } from './../utils/parseId';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { MyRequest } from './../utils/request';

const prisma = new PrismaClient();

export const invites = async (req: MyRequest, res: Response) => {
  const invites = await prisma.invite.findMany({
    where: {
      OR: [
        { receiverId: req.session.userId },
        { senderId: req.session.userId },
      ],
    },
  });

  return res.status(200).json({ data: invites });
};

export const invite = async () => {};

export const createInvite = async (req: MyRequest, res: Response) => {
  const projectId = parseId(req.body.projectId);
  const receiverId = parseId(req.body.receiverId);

  if (!projectId) {
    return res
      .status(400)
      .json({ error: { id: 'project', message: 'invalid id' } });
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

export const acceptInvite = async (req: MyRequest, res: Response) => {
  try {
    const inviteId = parseId(req.params.id);

    if (!inviteId) {
      return res.status(400);
    }

    const invite = await prisma.invite.findFirst({ where: { id: inviteId } });

    if (!invite) {
      return res.status(400).json({});
    }

    await prisma.$transaction([
      prisma.member.create({
        data: {
          isOwner: false,
          userId: req.session.userId!,
          projectId: invite.projectId,
        },
        select: {
          id: true,
          projectId: true,
          userId: true,
          isOwner: true,
        },
      }),
      prisma.invite.deleteMany({
        where: { AND: [{ id: inviteId }, { receiverId: req.session.userId! }] },
      }),
    ]);

    return res.status(204).json({});
  } catch (error) {
    console.error(error);
    return res.status(500).json({});
  }
};

export const declineInvite = async (req: MyRequest, res: Response) => {
  try {
    const inviteId = parseId(req.params.id);

    if (!inviteId) {
      return res.status(400).json({});
    }

    const invite = await prisma.invite.findFirst({ where: { id: inviteId } });

    if (!invite) {
      return res.status(400).json({
        error: {
          field: 'id',
          message: 'invalid id',
        },
      });
    }

    if (
      invite.receiverId == req.session.userId ||
      invite.senderId == req.session.userId
    ) {
      return res.status(401).json({
        error: {
          field: 'authentication',
          message: 'you are not authorized to do this action',
        },
      });
    }

    await prisma.invite.deleteMany({
      where: { AND: [{ id: inviteId }, { receiverId: req.session.userId! }] },
    });

    return res.status(204).json({});
  } catch (error) {
    console.error(error);
    return res.status(500).json({});
  }
};
