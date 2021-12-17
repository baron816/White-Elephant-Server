import { resolvers as userResolvers } from './User/resolvers';
import { resolvers as gameResolvers } from './Game/resolvers';
import { resolvers as submissionResolvers } from './Submission/resolvers';
import merge from 'lodash/merge';

export const resolvers = merge(
  userResolvers,
  gameResolvers,
  submissionResolvers
);
