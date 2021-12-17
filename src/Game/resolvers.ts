import { AuthenticationError } from 'apollo-server-errors';
import sample from 'lodash/sample';
import shuffle from 'lodash/shuffle';
import { Resolvers } from '../../generated/graphql';
import { Context } from '../types';

export const resolvers: Resolvers<Context> = {
  Query: {
    game(_, __, { user }) {
      if (user == null) {
        throw new AuthenticationError('No user present');
      }

      if (user.currentlyPlaying == null) {
        throw new Error('User not playing a game');
      }

      return user.currentlyPlaying as any;
    },
  },
  Mutation: {
    leaveGame: (_, __, { db, user }) => {
      if (user == null) {
        throw new AuthenticationError('No user present');
      }

      return db.user.update({
        where: { id: user.id },
        data: { currentlyPlayingId: null },
      });
    },
    endGame: async (_, __, { db, user }) => {
      if (user == null) {
        throw new AuthenticationError('No user present');
      }

      const game = user.currentlyPlaying;

      if (game == null) {
        throw new Error('User not playing a game');
      }

      if (user.id !== game.hostId) {
        throw new Error('User is not hosting game');
      }

      await db.game.delete({ where: { id: game.id } });
      return true;
    },
    createGame: (_, { topic }, { db, user }) => {
      if (user == null) {
        throw new AuthenticationError('No user present');
      }

      if (user.currentlyPlaying != null) {
        throw new Error('User already in a game');
      }

      return db.game.create({
        data: {
          hostId: user.id,
          topic,
          players: {
            connect: [{ id: user.id }],
          },
        },
      }) as any;
    },
    joinGame: async (_, { gameId }, { db, user }) => {
      if (user == null) {
        throw new AuthenticationError('No user present');
      }

      const game = await db.game.findUnique({ where: { id: gameId } });

      if (game?.active) {
        throw new Error('Game in progress');
      }

      return db.user.update({
        where: { id: user.id },
        data: { currentlyPlayingId: gameId },
      });
    },
    startGame: async (_, __, { db, user }) => {
      if (user == null) {
        throw new AuthenticationError('No user present');
      }

      if (user.currentlyPlayingId == null) {
        throw new Error('User not playing game');
      }

      const game = await db.game.findUnique({
        where: { id: user.currentlyPlayingId },
        include: { submissions: true },
      });

      if (game == null) {
        throw new Error('User not playing game');
      }

      if (user.id !== game.hostId) {
        throw new Error('Only the host can start the game');
      }

      const shuffledSubmissionIds = shuffle(
        game.submissions.map((submission) => submission.id)
      );

      return db.game.update({
        where: { id: game.id },
        data: { active: true, drawPile: shuffledSubmissionIds },
      }) as any;
    },
    drawFromPile: async (_, __, { db, user }) => {
      if (user == null) {
        throw new AuthenticationError('No ser present');
      }

      if (user.currentlyPlayingId == null) {
        throw new Error('User not in game');
      }

      const game = await db.game.findUnique({
        where: { id: user.currentlyPlayingId },
        include: { submissions: true, players: true },
      });

      if (game == null || game.currentPlayerId == null) {
        throw new Error('Game not found');
      }

      if (game.currentPlayerId != user.id) {
        throw new Error("Not player's turn");
      }

      const availablePicks = game.submissions.filter(
        (submission) =>
          submission.submitterId !== user.id && submission.possessorId == null
      );

      const isGameOver = availablePicks.length === 1;
      const pick = sample(availablePicks)!;

      const playerIdx = game.players.findIndex(
        (player) => player.id == user.id
      );

      const nextPlayerIdx =
        playerIdx + 1 >= game.players.length ? 0 : playerIdx + 1;
      const nextPlayer = game.players[nextPlayerIdx];

      return db.submission.update({
        where: { id: pick.id },
        data: {
          possessor: {
            connect: { id: user.id },
          },
          pastPossessor: {
            connect: { id: user.id },
          },
          game: {
            update: {
              currentPlayerId: nextPlayer.id,
              active: !isGameOver,
            },
          },
        },
      }) as any;
    },
  },
  Game: {
    players: (parent, args, { db }) => {
      return db.game.findUnique({ where: { id: parent.id } }).players();
    },
    host: (parent, args, { db }) => {
      return db.game.findUnique({ where: { id: parent.id } }).host() as any;
    },
    submissions: (parent, args, { db }) => {
      return db.game
        .findUnique({ where: { id: parent.id } })
        .submissions() as any;
    },
    currentPlayer(parent, args, { db }) {
      return db.game.findUnique({ where: { id: parent.id } }).currentPlayer();
    },
  },
};
