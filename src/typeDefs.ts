import fs from 'fs';

export const typeDefs = fs
  .readFileSync('./src/schema.graphql')
  .toString('utf-8');
