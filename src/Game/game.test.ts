import { gql } from 'apollo-server-core';
import { server } from '../index';
import { prisma } from '../prismaClient';
import { getContextRequest } from '../utils/testUtils';

const createGameMutation = gql`
  mutation CreateGame($topic: String!) {
    createGame(topic: $topic) {
      id
      topic
      host {
        name
        id
      }
      players {
        name
        id
      }
    }
  }
`;

const joinGameMutation = gql`
  mutation JoinGame($gameId: String!) {
    joinGame(gameId: $gameId) {
      currentlyPlaying {
        id
        players {
          id
        }
      }
    }
  }
`;

const leaveGameMutation = gql`
  mutation LeaveGame {
    leaveGame {
      currentlyPlaying {
        id
      }
    }
  }
`;

const endGameMutation = gql`
  mutation EndGame {
    endGame
  }
`;

const startGameMutation = gql`
  mutation StartGame {
    startGame {
      active
      submissions {
        id
      }
      drawPile
    }
  }
`;

const drawFromPileMutation = gql`
  mutation DrawFromPile {
    drawFromPile {
      title
      possessor {
        id
      }
      pastPossessor {
        id
      }
      game {
        active
      }
    }
  }
`;

describe('Game', () => {
  afterAll(async () => {
    const deleteSubmissions = prisma.submission.deleteMany();
    const deleteGames = prisma.game.deleteMany();
    const deleteUsers = prisma.user.deleteMany();

    await prisma.$transaction([deleteSubmissions, deleteGames, deleteUsers]);

    await prisma.$disconnect();
  });

  test('create a game', async () => {
    const user = await prisma.user.create({ data: { name: 'Sally' } });
    const res = await server.executeOperation(
      {
        query: createGameMutation,
        variables: { topic: 'Film' },
      },
      getContextRequest(user.id)
    );

    expect(res.data?.createGame).toMatchObject({
      topic: 'Film',
    });
    expect(res.data?.createGame.host).toMatchObject({ id: user.id });
    expect(res.data?.createGame.players).toEqual([
      { id: user.id, name: user.name },
    ]);
  });

  test('join a game', async () => {
    const user = await prisma.user.create({ data: { name: 'Mary' } });
    const host = await prisma.user.create({ data: { name: 'Dolly' } });

    const game = await prisma.game.create({
      data: {
        hostId: host.id,
        topic: 'Movies',
        players: {
          connect: [{ id: host.id }],
        },
      },
    });

    const res = await server.executeOperation(
      {
        query: joinGameMutation,
        variables: { gameId: game.id },
      },
      getContextRequest(user.id)
    );

    const result = res.data?.joinGame.currentlyPlaying;

    expect(result?.id).toBe(game.id);

    expect(result?.players).toContainEqual({ id: host.id });
    expect(result?.players).toContainEqual({ id: user.id });
  });

  test('leave game', async () => {
    const user = await prisma.user.create({ data: { name: 'Mary' } });
    const host = await prisma.user.create({ data: { name: 'Dolly' } });

    const game = await prisma.game.create({
      data: {
        hostId: host.id,
        topic: 'Movies',
        players: {
          connect: [{ id: host.id }, { id: user.id }],
        },
      },
    });

    const res = await server.executeOperation(
      {
        query: leaveGameMutation,
      },
      getContextRequest(user.id)
    );

    expect(res.data?.leaveGame.currentlyPlaying).toBeNull();
  });

  test('end game', async () => {
    const user = await prisma.user.create({ data: { name: 'Mary' } });
    const host = await prisma.user.create({ data: { name: 'Dolly' } });

    const game = await prisma.game.create({
      data: {
        hostId: host.id,
        topic: 'Movies',
        players: {
          connect: [{ id: host.id }, { id: user.id }],
        },
      },
    });

    const res = await server.executeOperation(
      {
        query: endGameMutation,
      },
      getContextRequest(host.id)
    );

    expect(res.data?.endGame).toBeTruthy();

    const refetchedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    expect(refetchedUser?.currentlyPlayingId).toBeNull();
  });

  test('start game', async () => {
    const user1 = await prisma.user.create({ data: { name: 'Mary' } });
    const user2 = await prisma.user.create({ data: { name: 'Barry' } });
    const user3 = await prisma.user.create({ data: { name: 'Harry' } });
    const user4 = await prisma.user.create({ data: { name: 'Larry' } });
    const user5 = await prisma.user.create({ data: { name: 'Gary' } });
    const host = await prisma.user.create({ data: { name: 'Dolly' } });

    const game = await prisma.game.create({
      data: {
        hostId: host.id,
        topic: 'Movies',
        players: {
          connect: [
            { id: host.id },
            { id: user1.id },
            { id: user2.id },
            { id: user3.id },
            { id: user4.id },
            { id: user5.id },
          ],
        },
        submissions: {
          create: [
            { title: 'Con Air', submitterId: host.id },
            { title: 'Leaving Las Vegas', submitterId: user1.id },
            { title: 'Face/Off', submitterId: user2.id },
            { title: 'Next', submitterId: user3.id },
            { title: 'City of Angels', submitterId: user4.id },
            { title: 'Amos and Andrew', submitterId: user5.id },
          ],
        },
      },
    });

    const res = await server.executeOperation(
      {
        query: startGameMutation,
      },
      getContextRequest(host.id)
    );

    expect(res.data?.startGame.active).toBeTruthy();
    expect(res.data?.startGame.drawPile).not.toBeNull();
  });

  test('draw from pile', async () => {
    const user1 = await prisma.user.create({ data: { name: 'Mary' } });
    const user2 = await prisma.user.create({ data: { name: 'Barry' } });
    const host = await prisma.user.create({ data: { name: 'Dolly' } });

    const game = await prisma.game.create({
      data: {
        hostId: host.id,
        topic: 'Movies',
        currentPlayerId: user1.id,
        players: {
          connect: [{ id: host.id }, { id: user1.id }, { id: user2.id }],
        },
        submissions: {
          create: [
            {
              title: 'Con Air',
              submitterId: host.id,
              possessorId: user2.id,
            },
            { title: 'Leaving Las Vegas', submitterId: user1.id },
            { title: 'Face/Off', submitterId: user2.id },
          ],
        },
      },
      include: { submissions: true },
    });

    const submission = game.submissions[0];

    await prisma.submission.update({
      where: { id: submission.id },
      data: {
        pastPossessor: {
          connect: [{ id: host.id }, { id: user2.id }],
        },
      },
    });

    const res = await server.executeOperation(
      {
        query: drawFromPileMutation,
      },
      getContextRequest(user1.id)
    );

    const result = res.data?.drawFromPile;

    expect(result?.game.active).toBeFalsy();
    expect(result?.title).toBe('Face/Off');
    expect(result?.possessor.id).toBe(user1.id);
    expect(result?.pastPossessor).toEqual([{ id: user1.id }]);
  });
});
