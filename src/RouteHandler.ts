import { FastifyReply, FastifyRequest } from 'fastify';
import { dbAllPet, dbPetById, dbDeletePet, dbAddPet, dbUpdatePet } from './models/pet.model';
import { dbCreateUser, dbLoginUser, dbSetToken, generateToken, verifyToken, revokeToken } from './models/user.model';
import { get } from 'http';

class RouteHandler {
  addPet = async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return reply.status(400).send({ status: false, error: 'Missing token' });
    }
    const id = await verifyToken(token);
    if (!id) {
      return reply.status(498).send({ status: false, error: 'Invalid token' });
    }

    const body: any = req.body;
    await dbAddPet(body, id);

    return reply.status(201).send({ status: true, message: 'Pet added' });
  };

  getPetById = async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return reply.status(400).send({ status: false, error: 'Missing token' });
    }
    const id = await verifyToken(token);
    if (!id) {
      return reply.status(498).send({ status: false, error: 'Invalid token' });
    }

    const params: any = req.params;
    const pet = await dbPetById(params.petId);
    if (!pet) {
      return reply.status(404).send({ status: false, error: 'Pet not found' });
    }

    return reply.status(200).send(pet);
  };

  getAllPets = async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return reply.status(400).send({ status: false, error: 'Missing token' });
    }
    const id = await verifyToken(token);
    if (!id) {
      return reply.status(498).send({ status: false, error: 'Invalid token' });
    }

    const pets = await dbAllPet();
    return reply.status(200).send(pets);
  };

  deletePet = async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return reply.status(400).send({ status: false, error: 'Missing token' });
    }
    const id = await verifyToken(token);
    if (!id) {
      return reply.status(498).send({ status: false, error: 'Invalid token' });
    }

    const params: any = req.params;
    const pet = await dbPetById(params.petId);
    if (!pet) {
      return reply.status(404).send({ status: false, error: 'Pet not found' });
    }

    await dbDeletePet(params.petId);
    return reply.status(200).send('delete ok');
  };

  updatePet = async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return reply.status(400).send({ status: false, error: 'Missing token' });
    }
    const id = await verifyToken(token);
    if (!id) {
      return reply.status(498).send({ status: false, error: 'Invalid token' });
    }

    const body: any = req.body;
    const pet = await dbPetById(body.id);
    if (!pet) {
      return reply.status(404).send({ status: false, error: 'Pet not found' });
    }

    await dbUpdatePet(body);
    return reply.status(200).send('update ok');
  };

  createUser = async (req: FastifyRequest, reply: FastifyReply) => {
    const { name, email, password }: any = req.body;

    if (!name || !email || !password) {
      return reply.status(400).send({ status: false, error: 'Missing fields' });
    }

    await dbCreateUser(name, email, password);
    return reply.status(201).send({ status: true, message: 'User created' });
  };

  loginUser = async (req: FastifyRequest, reply: FastifyReply) => {
    const { email, password }: any = req.body;

    if (!email || !password) {
      return reply.status(400).send({ status: false, saerror: 'Missing fields' });
    }

    const user = await dbLoginUser(email, password);
    if (!user) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const token: string = await generateToken(user.id);
    if (!token) {
      return reply.status(500).send({ error: 'Internal server error' });
    }

    await dbSetToken(user.id, token);
    return reply.status(200).send(token);
  };

  logoutUser = async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return reply.status(400).send({ status: false, error: 'Missing token' });
    }
    const id = await verifyToken(token);
    if (!id) {
      return reply.status(498).send({ status: false, error: 'Invalid token' });
    }

    await revokeToken(id);
    return reply.status(200).send({ status: true, message: 'Logout successful' });
  };
}

export default RouteHandler;
