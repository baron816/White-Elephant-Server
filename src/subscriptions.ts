// import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PubSub } from 'graphql-subscriptions';

// export const pubsub = new RedisPubSub();
export const pubsub = new PubSub();

export const GAME_UPDATED = 'GAME_UPDATED';

export function publishGameUpdated(gameId?: string | null) {
  if (gameId != null) {
    pubsub.publish(GAME_UPDATED, { gameUpdated: gameId });
  }
}
