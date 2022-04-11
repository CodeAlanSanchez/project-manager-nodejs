import { User } from '@prisma/client';

export const convertToSafeUser = (user: User) => {
  const { id, username, email, createdAt } = user;
  return {
    id,
    username,
    email,
    createdAt,
  };
};
