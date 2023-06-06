import type { Pet, User } from '@prisma/client';
import { prisma } from '../db.server';
export type { Pet } from '@prisma/client';

export async function dbPetById(id: Pet['id']) {
  return prisma.pet.findUnique({ where: { id } });
}

export async function dbAllPet() {
  return prisma.pet.findMany();
}

export async function dbAddPet(pet: Pet, owner: User['id']) {
  return prisma.pet.create({
    data: {
      ...pet,
      owner: owner,
    },
  });
}

export async function dbDeletePet(id: Pet['id']) {
  return prisma.pet.delete({ where: { id } });
}

export async function dbUpdatePet(pet: Pet) {
  return prisma.pet.update({ where: { id: pet.id }, data: pet });
}
