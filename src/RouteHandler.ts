import { FastifyReply, FastifyRequest } from 'fastify';
import { dbAllPet, dbPetById, dbDeletePet, dbAddPet, dbUpdatePet } from './models/pet.model';
import { dbCreateUser, dbLoginUser, dbSetToken, generateToken, dbUserById, verifyToken } from './models/user.model';

class RouteHandler {
  addPet = async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('Missing token');
    }
    await verifyToken(token);

    const body: any = req.body;
    await dbAddPet(body);
    return reply.send('created ok');
  };

  getPetById = async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('Missing token');
    }
    await verifyToken(token);

    const params: any = req.params;
    const pet = await dbPetById(params.petId);

    return reply.send(pet);
  };

  getAllPets = async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('Missing token');
    }
    await verifyToken(token);

    const pets = await dbAllPet();
    return reply.send(pets);
  };

  deletePet = async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('Missing token');
    }
    await verifyToken(token);

    const params: any = req.params;
    await dbDeletePet(params.petId);
    return reply.send('delete ok');
  };

  updatePet = async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('Missing token');
    }
    await verifyToken(token);

    const body: any = req.body;
    await dbUpdatePet(body);
    return reply.send('updated ok');
  };

  createUser = async (req: FastifyRequest, reply: FastifyReply) => {
    const { name, email, password }: any = req.body;

    if (!name || !email || !password) {
      return reply.status(400).send('Missing fields');
    }

    const user = await dbCreateUser(name, email, password);
    return reply.send('User created !');
  };

  loginUser = async (req: FastifyRequest, reply: FastifyReply) => {
    const { email, password }: any = req.body;

    if (!email || !password) {
      return reply.status(400).send('Missing fields');
    }

    const user = await dbLoginUser(email, password);
    if (!user) {
      return reply.status(401).send('Invalid credentials');
    }

    const token = await generateToken(user.id);
    await dbSetToken(user.id, token);

    return reply.send(token);
  };
}

export default RouteHandler;
