import { nameDescCheck } from '../utils/nameAndDescriptionCheck';
import { parseId } from './../utils/parseId';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { MyRequest } from './../utils/request';

const prisma = new PrismaClient();

// Returns projects where user is member in
export const projects = async (req: MyRequest, res: Response) => {
  const { userId } = req.session;
  const projects = await prisma.project.findMany({
    where: {
      members: {
        every: {
          userId: {
            equals: userId,
          },
        },
      },
    },
  });

  return res.status(200).json({ data: projects });
};

// Returns project if user is a member
export const project = async (req: MyRequest, res: Response) => {
  const id = parseId(req.params.id);

  if (id === null || id === NaN) {
    return res
      .status(400)
      .json({ error: { field: 'id', message: 'invalid id' } });
  }

  const project = await prisma.project.findFirst({
    where: { id },
    include: {
      members: {
        select: {
          user: {
            select: {
              username: true,
            },
          },
        },
      },
      bugs: {
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
        },
      },
    },
  });

  return res.status(200).json({ data: project });
};

// Creates new project and adds new member to project
export const createProject = async (req: MyRequest, res: Response) => {
  const { name, description } = req.body;

  nameDescCheck(name, description, 'project', res);

  const project = await prisma.project.create({
    data: { name, description },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  if (!project) {
    return res
      .status(500)
      .json({ error: { field: 'unknown', message: 'something went wrong' } });
  }

  const member = await prisma.member.create({
    data: {
      isOwner: true,
      userId: req.session.userId!,
      projectId: project.id,
    },
  });

  console.log(member);

  return res.status(201).json({ data: project });
};

// Updates existing project
export const updateProject = async (req: MyRequest, res: Response) => {
  const { name, description } = req.body;

  const id = parseId(req.body.id);

  if (id === null || id === NaN) {
    return res
      .status(400)
      .json({ error: { field: 'id', message: 'invalid id' } });
  }

  nameDescCheck(name, description, 'project', res);

  const updatedProject = await prisma.project.update({
    where: { id: id },
    data: { name, description },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  if (!updatedProject) {
    return res
      .status(404)
      .json({ error: { field: 'id', message: 'Project not found' } });
  }

  return res.status(200).json({ data: updatedProject });
};

export const deleteProject = async (req: MyRequest, res: Response) => {
  return res.status(403).json({
    error: {
      field: 'feature',
      message: 'deleting projects is not supported at this time',
    },
  });
};
