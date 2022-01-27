import { User } from '@prisma/client';

export const convertToSafeUser = (user: User) => {
  const { id, username, email } = user;
  return {
    id,
    username,
    email,
  };
};
