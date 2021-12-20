import { gql } from 'apollo-server-core';
import { server } from '../src/index';
import { prisma } from '../src/prismaClient';
import { getContextRequest } from './utils';

const submissionMutation = gql`
  mutation Submission($title: String!) {
    makeSubmission(title: $title) {
      title
      game {
        id
      }
      possessor {
        id
      }
      submitter {
        id
      }
      pastPossessor {
        id
      }
    }
  }
`;

const stealMutation = gql`
  mutation Steal($submissionId: String!) {
    steal(submissionId: $submissionId) {
      possessor {
        id
      }
      pastPossessor {
        id
      }
      game {
        currentPlayer {
          id
        }
      }
    }
  }
`;

describe('Submission', () => {
  afterAll(async () => {
    const deleteSubmissions = prisma.submission.deleteMany();
    const deleteGames = prisma.game.deleteMany();
    const deleteUsers = prisma.user.deleteMany();

    await prisma.$transaction([deleteSubmissions, deleteGames, deleteUsers]);

    await prisma.$disconnect();
  });

  test('make a submission', async () => {
    const host = await prisma.user.create({ data: { name: 'Rocky' } });
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
        query: submissionMutation,
        variables: { title: 'The Rock' },
      },
      getContextRequest(host.id)
    );

    const createdSubmission = res.data?.makeSubmission;

    expect(createdSubmission.title).toBe('The Rock');
    expect(createdSubmission.game.id).toBe(game.id);
    expect(createdSubmission.possessor).toBeNull();
    expect(createdSubmission.submitter.id).toBe(host.id);
    expect(createdSubmission.pastPossessor).toEqual([]);
  });

  test('steal a submission', async () => {
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
        currentPlayerId: user1.id,
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
            {
              title: 'Con Air',
              submitterId: host.id,
              possessorId: user2.id,
            },
            { title: 'Leaving Las Vegas', submitterId: user1.id },
            { title: 'Face/Off', submitterId: user2.id },
            { title: 'Next', submitterId: user3.id },
            { title: 'City of Angels', submitterId: user4.id },
            { title: 'Amos and Andrew', submitterId: user5.id },
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
          connect: [{ id: user3.id }, { id: user2.id }],
        },
      },
    });

    const res = await server.executeOperation(
      {
        query: stealMutation,
        variables: { submissionId: submission.id },
      },
      getContextRequest(user1.id)
    );

    const result = res.data?.steal;
    expect(result).toMatchObject({
      game: {
        currentPlayer: { id: user2.id },
      },

      possessor: {
        id: user1.id,
      },
    });
    expect(result.pastPossessor).toContainEqual({ id: user1.id });
    expect(result.pastPossessor).toContainEqual({ id: user2.id });
    expect(result.pastPossessor).toContainEqual({ id: user3.id });
  });
});
