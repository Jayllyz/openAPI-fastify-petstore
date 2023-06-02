import type { User } from '@prisma/client';
import { prisma } from '../db.server';
export type { User } from '@prisma/client';

const jwt = require('jsonwebtoken');

export async function generateToken(user: User) {
  const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
}

export async function dbUserById(id: User['id']) {
  return prisma.user.findUnique({ where: { id } });
}

export async function dbLoginUser(email: User['email'], password: User['password']) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && user.password === password) {
    return user;
  }
  return null;
}

export async function revokeToken(id: User['id']) {
  return prisma.user.update({ where: { id }, data: { token: null } });
}

export async function createToken(id: User['id'], token: User['token']) {
  return prisma.user.update({ where: { id }, data: { token } });
}
