// src/index.js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const bodyParser = require('body-parser');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const DataRepository = require('./repositories/dataRepository');

const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTYiLCJ1c2VybmFtZSI6ImRlbW9Vc2VyIiwiZXhwIjoxNzQ2ODAzNjAwfQ.RZ1p7fw8KjVqW_Fdmlz0OxV6B_1r45yqDdv0lXtNn9c';

async function start() {
  const app = express();
  app.use(cors());

  // Authentication middleware (simple Bearer check)
  app.use((req, res, next) => {
    const auth = req.get('authorization') || '';
    const parts = auth.split(/\s+/);
    if (parts.length === 2 && /^Bearer$/i.test(parts[0]) && parts[1] === AUTH_TOKEN) {
      req.user = { token: parts[1] }; // minimal user object, extensible later
    } else {
      req.user = null;
    }
    next();
  });

  // instantiate repository and pass to context for resolvers / services
  const repo = new DataRepository('./data');

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      if (!req.user) {
        const { AuthenticationError } = require('apollo-server-errors');
        throw new AuthenticationError('Missing or invalid Authorization header. Provide: Authorization: Bearer token');
      }
      return { repo, user: req.user };
    },
    introspection: true,
    playground: true
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`GraphQL server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log('Use Authorization: Bearer super-secret-token-123456');
  });
}

start().catch(err => {
  console.error('Failed to start server', err);
});
