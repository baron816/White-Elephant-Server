import { gql } from 'apollo-server-core';
import { server } from '../index';
import { prisma } from '../prismaClient';
import { getContextRequest } from '../utils/testUtils';

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
    // const deleteSubmissions = prisma.submission.deleteMany();
    // const deleteGames = prisma.game.deleteMany();
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
