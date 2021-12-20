import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { createServer as createHttpServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers } from './resolvers';
import { prisma } from './prismaClient';
import { typeDefs } from './typeDefs';
import { Context } from './types';

const app = express();
const httpServer = createHttpServer(app);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const subscriptionServer = SubscriptionServer.create(
  {
    schema,
    execute,
    subscribe,
    async onConnect(connectionParams: any) {
      const token = connectionParams.Authorization;
      if (token == null) {
        throw new Error('Missing auth token');
      }
      const user = await prisma.user.findUnique({
        where: { id: token },
        include: { currentlyPlaying: true },
      });
      return {
        user,
        db: prisma,
      };
    },
  },
  { server: httpServer, path: '/graphql' }
);

export const server = new ApolloServer({
  context: async ({ req }) => {
    const token = req.headers.authorization;
    const ctx: Context = {
      db: prisma,
    };

    if (token == null) {
      return ctx;
    }

    const user = await prisma.user.findUnique({
      where: { id: token },
      include: { currentlyPlaying: true },
    });

    if (!user) {
      return ctx;
    }

    ctx.user = user;

    return ctx;
  },
  schema,
  plugins: [
    {
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close();
          },
        };
      },
    },
  ],
});

(async function () {
  if (process.env.NODE_ENV !== 'test') {
    await server.start();
    server.applyMiddleware({ app });
    const PORT = 4000;
    httpServer.listen(PORT, () => {
      console.log(`Server is now running on http://localhost:${PORT}/graphql`);
    });
  }
})();
