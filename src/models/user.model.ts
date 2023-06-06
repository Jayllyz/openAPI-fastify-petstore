import type { User } from '@prisma/client';
import { prisma } from '../db.server';
export type { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function generateToken(id: User['id']) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not set');
  if (!id) throw new Error('id not set');
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
}

export async function dbUserById(id: User['id']) {
  return prisma.user.findUnique({ where: { id } });
}

export async function verifyToken(token: User['token']) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not set');
  if (!token) return null;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (typeof decoded === 'string') {
    return null;
  }

  const user = await dbUserById(decoded.id);
  if (!user || !user.token) {
    return null;
  }

  return user.id;
}

export async function dbCreateUser(name: User['name'], email: User['email'], password: User['password']) {
  const salt = process.env.SALT;
  if (!salt) throw new Error('SALT not set');

  const hashedPassword = await bcrypt.hash(password, parseInt(salt));
  const token = null;
  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      token,
    },
  });
}

export async function dbLoginUser(email: User['email'], password: User['password']) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return null;
    }
    return user;
  }
  return null;
}

export async function revokeToken(id: User['id']) {
  return prisma.user.update({ where: { id }, data: { token: null } });
}

export async function dbSetToken(id: User['id'], token: User['token']) {
  return prisma.user.update({ where: { id }, data: { token } });
}
