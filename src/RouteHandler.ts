import { FastifyReply, FastifyRequest } from 'fastify';
import { dbAllPet, dbPetById, dbDeletePet, dbAddPet, dbUpdatePet, Pet } from './models/pet.model';
import { dbCreateUser, dbLoginUser, dbSetToken, generateToken, verifyToken, revokeToken } from './models/user.model';
import { Exception, tokenExist } from './utils';

class RouteHandler {
  addPet = async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.headers.authorization?.split(' ')[1];
    const id = await verifyToken(token!);

    const body: any = req.body;
    if (!body.name)
      throw new Exception(400, 'Missing name');

    await dbAddPet(body, id);

    return reply.status(201).send({ status: true, message: 'Pet added' });
  };

  getPetById = async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.headers.authorization?.split(' ')[1];
    await verifyToken(token!);

    const params = req.params as { petId: number };
    const pet = await dbPetById(params.petId);

    return reply.status(200).send(pet);
  };

  getAllPets = async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.headers.authorization?.split(' ')[1];
    await verifyToken(token!);

    const pets = await dbAllPet();
    return reply.status(200).send(pets);
  };

  deletePet = async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.headers.authorization?.split(' ')[1];
    await verifyToken(token!);

    const params: any = req.params as { petId: number };
    const pet = await dbPetById(params.petId);
    if (!pet)
      throw new Exception(404, 'Pet not found');

    await dbDeletePet(params.petId);
    return reply.status(200).send('delete ok');
  };

  updatePet = async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.headers.authorization?.split(' ')[1];
    await verifyToken(token!);

    const body = req.body as Pet;
    const pet = await dbPetById(body.id);
    if (!pet)
      throw new Exception(404, 'Pet not found');

    await dbUpdatePet(body);
    return reply.status(200).send('update ok');
  };

  createUser = async (req: FastifyRequest, reply: FastifyReply) => {
    const { name, email, password } = req.body as { name: string; email: string; password: string };

    if (!name || !email || !password)
      throw new Exception(400, 'Missing fields');

    await dbLoginUser(email, password);

    await dbCreateUser(name, email, password);
    return reply.status(201).send({ status: true, message: 'User ' + name + ' added' });
  };

  loginUser = async (req: FastifyRequest, reply: FastifyReply) => {
    const { email, password }: any = req.body;

    if (!email || !password)
      throw new Exception(400, 'Missing fields');

    const user = await dbLoginUser(email, password);

    const token: string = await generateToken(user.id);
    tokenExist(token);

    await dbSetToken(user.id, token);
    return reply.status(200).send(token);
  };

  logoutUser = async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.headers.authorization?.split(' ')[1];
    const id = await verifyToken(token!);

    await revokeToken(id);
    return reply.status(200).send({ status: true, message: 'Logout successful' });
  };
}

export default RouteHandler;
