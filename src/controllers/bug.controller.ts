import { nameDescCheck } from './../utils/nameAndDescriptionCheck';
import { parseId } from './../utils/parseId';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { MyRequest } from './../utils/request';

const prisma = new PrismaClient();

export const bugs = async (req: MyRequest, res: Response) => {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: { id: 'id', message: 'invalid id' } });
  }

  const bugs = await prisma.bug.findMany({
    where: {
      projectId: id,
      project: { members: { some: { userId: req.session.userId } } },
    },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      creator: { select: { id: true } },
    },
  });

  return res.status(200).json({ bugs });
};

export const bug = async (req: MyRequest, res: Response) => {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: { id: 'id', message: 'invalid id' } });
  }

  const bug = await prisma.bug.findFirst({
    where: {
      AND: [
        { id },
        { project: { members: { some: { userId: req.session.userId } } } },
      ],
    },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      project: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
  });

  if (!bug)
    return res.status(400).json({
      error: {
        field: 'authorization',
        message: 'you are not a member of this project',
      },
    });

  return res.status(200).json({ bug });
};

export const createBug = async (req: MyRequest, res: Response) => {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: { id: 'id', message: 'invalid id' } });
  }

  const { name, description } = req.body;

  const member = await prisma.member.findFirst({
    where: { AND: [{ projectId: id }, { userId: req.session.userId }] },
  });

  if (!member) {
    return res.status(401).json({
      error: {
        field: 'authorization',
        message: 'you are not a member of this project',
      },
    });
  }

  const bug = await prisma.bug.create({
    data: {
      name,
      description,
      project: { connect: { id } },
      status: 'open',
      creator: { connect: { id: member?.id } },
    },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      project: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
  });

  return res.status(201).json({ bug });
};

export const updateBug = async (req: MyRequest, res: Response) => {
  const { name, description, status } = req.body;

  const id = parseId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: { id: 'id', message: 'invalid id' } });
  }

  if (['open', 'started', 'closed'].indexOf(status) === -1) {
    return res.status(400).json({
      error: {
        field: 'status',
        message: "invalid status (must be: 'open', 'started', or 'closed')",
      },
    });
  }

  const updatedBug = await prisma.bug.update({
    where: { id },
    data: { name, description, status },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      project: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
  });

  return res.status(200).json({ updatedBug });
};
export const deletebug = async (req: MyRequest, res: Response) => {
  const id = parseInt(req.params.id);

  if (!id) {
    return res.status(400).json({ error: { id: 'id', message: 'invalid id' } });
  }

  const bug = await prisma.bug.delete({ where: { id: id } });

  if (!bug) {
    res.status(500).json({
      field: 'server',
      message: 'something went wrong',
    });
  }

  return res.status(204);
};
