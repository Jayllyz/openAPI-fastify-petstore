import { FastifyReply, FastifyRequest } from 'fastify';
import { dbAllPet, dbPetById, dbDeletePet, dbAddPet, dbUpdatePet } from './models/pet.model';

class RouteHandler {
  addPet = async (req: FastifyRequest, reply: FastifyReply) => {
    const body: any = req.body;
    await dbAddPet(body);
    return reply.send('created ok');
  };

  getPetById = async (req: FastifyRequest, reply: FastifyReply) => {
    const params: any = req.params;
    const pet = await dbPetById(params.petId);
    return reply.send(pet);
  };

  getAllPets = async (req: FastifyRequest, reply: FastifyReply) => {
    const pets = await dbAllPet();
    return reply.send(pets);
  };

  deletePet = async (req: FastifyRequest, reply: FastifyReply) => {
    const params: any = req.params;
    await dbDeletePet(params.petId);
    return reply.send('delete ok');
  };

  updatePet = async (req: FastifyRequest, reply: FastifyReply) => {
    const body: any = req.body;
    await dbUpdatePet(body);
    return reply.send('updated ok');
  };
}

export default RouteHandler;
