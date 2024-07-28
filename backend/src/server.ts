import Fastify from 'fastify';
import fastifyJwt from 'fastify-jwt';
import fastifyCors from '@fastify/cors';
import bcrypt from 'bcryptjs';
import { Sequelize } from 'sequelize';
import User from '../models/user.js'; // Adjust path if needed
import Token from '../models/token.js'; // Adjust path if needed

const fastify = Fastify({ logger: true });

const sequelize = new Sequelize('mydatabase', 'postgres', '123', {
  host: 'localhost',
  dialect: 'postgres',
});
fastify.register(fastifyJwt, { secret: 'supersecret' });

fastify.register(fastifyCors, {
  origin: '*', 
});
const models = {
  User: User(sequelize),
  Token: Token(sequelize),
};


// Register routes
fastify.post('/register', async (request, reply) => {
  try {
    const { fullName, email, password } = request.body as any;
    console.log('Received registration request:', request.body);

    const hashedPassword = await bcrypt.hash(password, 10); 
   
    const user = await models.User.create({ firstName: fullName, email, password: hashedPassword });
    console.log('User created successfully:', user);
    reply.status(201).send(user);
  } catch (error) {
    reply.send(error);
  }
});

fastify.post('/login', async (request, reply) => {
  const { email, password } = request.body as any;
  try {
    const user :any = await models.User.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      // Revoke existing tokens for the user
      await models.Token.update({ state: 'revoked' }, { where: { userId: user.id } });

      const token = fastify.jwt.sign({ id: user.id });
      await models.Token.create({ token, userId: user.id, state: 'active' });
      reply.send({ id: user.id, email: user.email, token });
    } else {
      reply.status(401).send('Unauthorized');
    }
  } catch (error) {
    reply.send(error);
  }
});

fastify.post('/logout', async (request, reply) => {
  const { token } = request.body as any;
  try {
    const decoded = fastify.jwt.verify(token) as { id: string };
    await models.Token.update({ state: 'revoked' }, { where: { token, userId: decoded.id } });
    reply.send({ success: true });
  } catch (error) {
    reply.status(401).send('Unauthorized');
  }
});

// Start server
fastify.listen({ port: 3001 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});
