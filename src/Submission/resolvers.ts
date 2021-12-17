import { AuthenticationError } from 'apollo-server-errors';
import { Resolvers } from '../../generated/graphql';
import { Context } from '../types';

export const resolvers: Resolvers<Context> = {
  Mutation: {
    makeSubmission: async (_, { title }, { db, user }) => {
      if (user == null) {
        throw new AuthenticationError('No ser present');
      }

      if (user.currentlyPlayingId == null) {
        throw new Error('User not in game');
      }

      const gameSubmissions = await db.game
        .findUnique({ where: { id: user.currentlyPlayingId } })
        .submissions();

      if (
        gameSubmissions.some((submission) => submission.submitterId === user.id)
      ) {
        throw new Error('User already made submission');
      }

      return db.submission.create({
        data: {
          title,
          submitterId: user.id,
          gameId: user.currentlyPlayingId,
        },
      }) as any;
    },
    steal: async (_, { submissionId }, { db, user }) => {
      if (user == null) {
        throw new AuthenticationError('No ser present');
      }

      if (user.currentlyPlayingId == null) {
        throw new Error('User not in game');
      }

      const game = await db.game.findUnique({
        where: { id: user.currentlyPlayingId },
      });

      if (game == null || game.currentPlayerId == null) {
        throw new Error('Game not found');
      }

      if (game.currentPlayerId != user.id) {
        throw new Error("Not player's turn");
      }

      const submission = await db.submission.findUnique({
        where: { id: submissionId },
        include: { pastPossessor: true },
      });

      if (submission == null) {
        throw new Error('Submission not found');
      }

      if (submission.submitterId === user.id) {
        throw new Error('Player cannot take their own submission');
      }

      if (
        submission.pastPossessor.some((possessor) => possessor.id === user.id)
      ) {
        throw new Error('Player cannot take back lost submission');
      }

      const nextPlayerId = submission.possessorId!;

      const updatedSubmission = await db.submission.update({
        where: { id: submissionId },
        data: {
          possessor: {
            connect: { id: user.id },
          },
          pastPossessor: {
            connect: { id: user.id },
          },
          game: {
            update: {
              currentPlayerId: nextPlayerId,
            },
          },
        },
      });

      return updatedSubmission as any;
    },
  },
  Submission: {
    submitter(parent, args, { db }) {
      return db.submission
        .findUnique({ where: { id: parent.id } })
        .submitter() as any;
    },
    possessor(parent, args, { db }) {
      return db.submission.findUnique({ where: { id: parent.id } }).possessor();
    },
    pastPossessor(parent, args, { db }) {
      return db.submission
        .findUnique({ where: { id: parent.id } })
        .pastPossessor();
    },
    game(parent, args, { db }) {
      return db.submission
        .findUnique({ where: { id: parent.id } })
        .game() as any;
    },
  },
};
