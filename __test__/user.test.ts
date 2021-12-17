import { gql } from 'apollo-server-core';
import { server } from '../src/index';
import { prisma } from '../src/prismaClient';
import { getContextRequest } from './utils';

const createUserMutation = gql`
  mutation CreateUser($name: String!) {
    createUser(name: $name) {
      id
      name
      currentlyPlaying {
        id
      }
    }
  }
`;

const getUserQuery = gql`
  query GetUser {
    user {
      id
      name
    }
  }
`;

describe('User', () => {
  beforeAll(async () => {
    await prisma.user.createMany({ data: [{ name: 'Dude' }, { name: 'Bro' }] });
  });

  afterAll(async () => {
    const deleteUsers = prisma.user.deleteMany();

    await prisma.$transaction([deleteUsers]);

    await prisma.$disconnect();
  });

  test('create a user', async () => {
    const res = await server.executeOperation(
      {
        query: createUserMutation,
        variables: { name: 'Baron' },
      },
      getContextRequest()
    );
    expect(res.data?.createUser).toMatchObject({
      name: 'Baron',
      currentlyPlaying: null,
    });
  });

  test('fetch a user', async () => {
    const user = await prisma.user.create({ data: { name: 'Timmy' } });
    const res = await server.executeOperation(
      {
        query: getUserQuery,
      },
      getContextRequest(user.id)
    );

    expect(res.data?.user).toEqual({ id: user.id, name: user.name });
  });
});
