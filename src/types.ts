import { User, Game, PrismaClient } from '@prisma/client';

export interface Context {
  db: PrismaClient;
  user?: User & {
    currentlyPlaying: Game | null;
  };
}
