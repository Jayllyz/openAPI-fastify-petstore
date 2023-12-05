import type { Pet, User } from '@prisma/client';
import { prisma } from '../db.server';
import { Exception } from '../utils';
export type { Pet } from '@prisma/client';

export async function dbPetById(id: Pet['id']) {
  return prisma.pet.findUniqueOrThrow({ where: { id } });
}

export async function dbAllPet() {
  try {
    return await prisma.pet.findMany();
  } catch (error: any) {
    throw new Exception(500, error.message);
  }
}

export async function dbAddPet(pet: Pet, owner: User['id']) {
  try {
    return await prisma.pet.create({
      data: {
        ...pet,
        owner: owner,
      },
    });
  } catch (error: any) {
    throw new Exception(500, error.message);
  }
}

export async function dbDeletePet(id: Pet['id']) {
  try {
    return await prisma.pet.delete({ where: { id } });
  } catch (error: any) {
    throw new Exception(500, error.message);
  }
}

export async function dbUpdatePet(pet: Pet) {
  try {
    return await prisma.pet.update({
      where: { id: pet.id },
      data: pet,
    });
  } catch (error: any) {
    throw new Exception(500, error.message);
  }
}
