import type { prisma } from './prismaClient';
import { User, Game } from '@prisma/client';

export interface Context {
  db: typeof prisma;
  user?: User & {
    currentlyPlaying: Game | null;
  };
}
