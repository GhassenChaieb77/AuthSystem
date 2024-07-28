import Fastify from 'fastify';
import fastifyJwt from 'fastify-jwt';
import fastifyCors from '@fastify/cors';
import bcrypt from 'bcrypt';
import { Sequelize } from 'sequelize';
import User from '../models'; // Adjust the path as needed

const fastify = Fastify({ logger: true });

const sequelize = new Sequelize('mydatabase', 'postgres', '123', {
  host: 'localhost',
  dialect: 'postgres',
});

fastify.register(fastifyJwt, { secret: 'supersecret' });
fastify.register(fastifyCors);



fastify.post('/register', async (request, reply) => {
  const { fullName, email, password } = request.body as any;
  console.log('Received registration request:', request.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    
    const user = await User.create({ fullName, email, password: hashedPassword });
    console.log('User created successfully:', user);
    reply.send(user);
  } catch (error) {
    reply.send(error);
  }
});

fastify.post('/login', async (request, reply) => {
  const { email, password } = request.body as any;
  try {
    const user = await User.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      // Revoke existing tokens for the user
      await Token.update({ status: 'revoked' }, { where: { userId: user.id } });

      const token = fastify.jwt.sign({ id: user.id });
      await Token.create({ token, userId: user.id, status: 'active' });
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
    const decoded = fastify.jwt.verify(token)  as { id: string }; ;
    await Token.update({ status: 'revoked' }, { where: { token, userId: decoded.id } });
    reply.send({ success: true });
  } catch (error) {
    reply.status(401).send('Unauthorized');
  }
});
/*
fastify.put('/update-user', async (request, reply) => {
  const { email,  } = request.body as any;
  try {
    await User.update({  }, { where: { email } });
    reply.send({ success: true });
  } catch (error) {
    reply.send(error);
  }
});

*/

fastify.listen({ port: 3001 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});
