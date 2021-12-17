import { ApolloServer } from 'apollo-server';
import { resolvers } from './resolvers';
import { prisma } from './prismaClient';
import { typeDefs } from './typeDefs';
import { Context } from './types';

export const server = new ApolloServer({
  context: async ({ req }) => {
    const token = req.headers.authorization ?? '';
    const ctx: Context = {
      db: prisma,
    };

    if (!token) {
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
  typeDefs,
  resolvers,
});

if (process.env.NODE_ENV !== 'test') {
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
}
