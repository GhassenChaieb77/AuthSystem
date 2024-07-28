"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fastify_jwt_1 = __importDefault(require("fastify-jwt"));
const cors_1 = __importDefault(require("@fastify/cors"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sequelize_1 = require("sequelize");
const user_js_1 = __importDefault(require("../models/user.js")); // Adjust path if needed
const token_js_1 = __importDefault(require("../models/token.js")); // Adjust path if needed
const fastify = (0, fastify_1.default)({ logger: true });
const sequelize = new sequelize_1.Sequelize('mydatabase', 'postgres', '123', {
    host: 'localhost',
    dialect: 'postgres',
});
fastify.register(fastify_jwt_1.default, { secret: 'supersecret' });
fastify.register(cors_1.default, {
    origin: '*',
});
const models = {
    User: (0, user_js_1.default)(sequelize),
    Token: (0, token_js_1.default)(sequelize),
};
// Register routes
fastify.post('/register', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password } = request.body;
        console.log('Received registration request:', request.body);
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Split fullName into firstName and lastName
        const [firstName, lastName] = fullName.split(' ');
        const user = yield models.User.create({ firstName, lastName, email, password: hashedPassword });
        console.log('User created successfully:', user);
        reply.status(201).send(user);
    }
    catch (error) {
        reply.send(error);
    }
}));
fastify.post('/login', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = request.body;
    try {
        const user = yield models.User.findOne({ where: { email } });
        if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
            yield models.Token.update({ state: 'revoked' }, { where: { userId: user.id } });
            const token = fastify.jwt.sign({ id: user.id });
            yield models.Token.create({ token, userId: user.id, state: 'active' });
            reply.send({ id: user.id, email: user.email, token });
        }
        else {
            reply.status(401).send('Unauthorized');
        }
    }
    catch (error) {
        reply.send(error);
    }
}));
fastify.post('/logout', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = request.body;
    try {
        const decoded = fastify.jwt.verify(token);
        yield models.Token.update({ state: 'revoked' }, { where: { token, userId: decoded.id } });
        reply.send({ success: true });
    }
    catch (error) {
        reply.status(401).send('Unauthorized');
    }
}));
// Start server
fastify.listen({ port: 3001 }, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`Server listening at ${address}`);
});
