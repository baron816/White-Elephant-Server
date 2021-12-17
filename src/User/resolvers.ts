import { AuthenticationError } from 'apollo-server-errors';
import { Resolvers } from '../../generated/graphql';
import { Context } from '../types';

export const resolvers: Resolvers<Context> = {
  Query: {
    user: (_, __, { user }) => {
      if (user == null) {
        throw new AuthenticationError('No user present');
      }

      return user as any;
    },
  },
  Mutation: {
    createUser: (_, { name }, { db }) => {
      return db.user.create({
        data: { name },
      });
    },
  },
  User: {
    currentlyPlaying(parent, args, { db }) {
      return db.user
        .findUnique({ where: { id: parent.id } })
        .currentlyPlaying() as any;
    },
  },
};
