import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

const options = {
  port: 6379,
  host: '0.0.0.0',
  password: 'sOmE_sEcUrE_pAsS',
  family: 4,
};

export const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options),
});

export const GAME_UPDATED = 'GAME_UPDATED';

export function publishGameUpdated(gameId?: string | null) {
  if (gameId != null) {
    pubsub.publish(GAME_UPDATED, { gameUpdated: gameId });
  }
}
