import type { User } from '@prisma/client';
import { prisma } from '../db.server';
export type { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { tokenExist, Exception } from '../utils';

export async function generateToken(id: User['id']) {
  if (!process.env.JWT_SECRET) throw new Exception(500, 'JWT_SECRET not set');
  if (!id) throw new Exception(500, 'Missing id');
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
}

export async function dbUserById(id: User['id']) {
  return prisma.user.findUniqueOrThrow({ where: { id } });
}

export async function verifyToken(token: string) {
  if (!process.env.JWT_SECRET) throw new Exception(500, 'JWT_SECRET not set');
  tokenExist(token);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (typeof decoded === 'string') 
    throw new Exception(401, 'Invalid token');

  const user = await dbUserById(decoded.id);
  if (!user || !user.token) 
    throw new Exception(401, 'Invalid token');

  return user.id;
}

export async function dbCreateUser(name: User['name'], email: User['email'], password: User['password']) {
  const salt = process.env.SALT;
  if (!salt) throw new Exception(500, 'SALT not set');

  const hashedPassword = await bcrypt.hash(password, parseInt(salt));
  const token = null;
  try {
    return await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        token,
      },
    });
  } catch (error: any) {
    throw new Exception(500, error.message);
  }
}

export async function dbLoginUser(email: User['email'], password: User['password']) {
  const user = await prisma.user.findUniqueOrThrow({ where: { email } });
  if (user) {
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      throw new Exception(401, 'Invalid credentials');
    return user;
  }
  throw new Exception(401, 'Invalid credentials');
}

export async function revokeToken(id: User['id']) {
  try {
    return await prisma.user.update({ where: { id }, data: { token: null } });
  } catch (error: any) {
    throw new Exception(500, error.message);
  }
}

export async function dbSetToken(id: User['id'], token: User['token']) {
  try {
    return await prisma.user.update({ where: { id }, data: { token } });
  } catch (error: any) {
    throw new Exception(500, error.message);
  }
}
