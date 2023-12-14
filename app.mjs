// app.mjs
import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import { router } from './routes/users.js';
import './src/db.js';
import { ApolloServer, gql } from 'apollo-server-express';
import Film from './src/film.js';
import User from './models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(new URL(import.meta.url).pathname, 'public')));
app.use(express.json());
app.use('/users', router);

// Define a chave secreta
const chaveSecreta = 'suaChaveSecreta';

const typeDefs = gql`
  type Query {
    filmes: [Filme]
    usuarios: [Usuario]
    checkEmailExists(email: String!): Boolean
    searchFilmes(name: String!): [Filme]
  }


  type Mutation {
    loginUser(email: String!, password: String!): AuthPayload
  }

  type AuthPayload {
    user: Usuario
    token: String
  }

  type Filme {
    id: ID
    name: String
    image: String
  }

  type Usuario {
    id: ID
    name: String
    email: String
    password: String
  }
`;

const resolvers = {
  Query: {
    filmes: async () => {
      const filmes = await Film.find();
      return filmes;
    },
    usuarios: async () => {
      const usuarios = await User.find();
      return usuarios;
    },
    checkEmailExists: async (_, { email }) => {
      const user = await User.findOne({ email });
      return !!user;
    },
    searchFilmes: async (_, { name }) => {
      const filmes = await Film.find({ name: { $regex: new RegExp(name, 'i') } });
      return filmes;
    },
  },
  Mutation: {
    loginUser: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error('Credenciais inválidas');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          throw new Error('Credenciais inválidas');
        }

        const token = jwt.sign({ userId: user.id }, chaveSecreta, {
          expiresIn: '1h', // Defina o tempo de expiração do token conforme sua necessidade
        });

        return {
          user,
          token,
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

await server.start();

server.applyMiddleware({ app });

// Rota de Login fora do GraphQL
app.post('/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    const token = jwt.sign({ userId: user.id }, chaveSecreta, {
      expiresIn: '1h',
    });

    res.json({ success: true, message: 'Login bem-sucedido!', token });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message || 'Erro ao fazer login' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor foi iniciado na porta 3000`);
  console.log(`GraphQL Playground disponível em http://localhost:3000/graphql`);
});
