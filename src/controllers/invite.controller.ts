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
    select: {
      id: true,
      createdAt: true,
      projectId: true,
      receiverId: true,
      senderId: true,
    },
  });

  return res.status(200).json({ invites });
};

export const invite = async () => {};

export const createInvite = async (req: MyRequest, res: Response) => {
  const projectId = parseId(req.body.projectId);
  const receiverId = parseId(req.body.receiverId);
  const inviterId = parseId(req.session.userId);

  if (!projectId) {
    return res
      .status(400)
      .json({ error: { field: 'project', message: 'invalid id' } });
  }

  if (!receiverId) {
    return res
      .status(400)
      .json({ error: { field: 'receiver', message: 'invalid id' } });
  }

  if (!inviterId) {
    return res
      .status(400)
      .json({ error: { field: 'sender', message: 'invalid id' } });
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId },
    include: { members: true, invites: true },
  });

  const user = await prisma.user.findFirst({
    where: { id: receiverId },
  });

  // Check if user being invited exists
  if (!user) {
    return res.status(404).json({
      error: {
        id: 'user',
        message: 'user does not exist',
      },
    });
  }

  // Check if project exists
  if (!project) {
    return res.status(404).json({
      error: {
        id: 'project',
        message: 'project not found',
      },
    });
  }

  // Check if receiver is already in project
  if (project.members.filter((i) => i.id === receiverId).length > 0) {
    return res.status(400).json({
      error: {
        id: 'user',
        message: 'user is already in project',
      },
    });
  }

  // Check if inviter is in project
  if (project.members.filter((i) => i.id === inviterId).length > 0) {
    return res.status(400).json({
      error: {
        id: 'authentication',
        message: 'you are not a member of this project',
      },
    });
  }

  // Check if invitee is already invited to project
  if (project.invites.filter((i) => i.receiverId === receiverId).length > 0) {
    return res.status(400).json({
      error: {
        id: 'invite',
        message: 'user is already invited to project',
      },
    });
  }

  const invite = await prisma.invite.create({
    data: {
      senderId: inviterId,
      receiverId: receiverId,
      projectId: projectId,
    },
    select: {
      id: true,
      project: true,
      receiver: true,
      sender: true,
    },
  });

  console.log(invite);

  if (!invite) {
    return res.status(400).json({
      error: {
        id: 'unknown',
        message: 'something went wrong, please check id values',
      },
    });
  }

  return res.status(201).json({ invite });
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

    return res.status(204).json({ id: inviteId });
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
      invite.receiverId != req.session.userId ||
      invite.senderId != req.session.userId
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

    return res.status(204).json({ id: inviteId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({});
  }
};
