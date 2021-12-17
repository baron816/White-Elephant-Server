import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Game = {
  __typename?: 'Game';
  active: Scalars['Boolean'];
  currentPlayer?: Maybe<User>;
  drawPile: Array<Maybe<Scalars['String']>>;
  host: User;
  id: Scalars['String'];
  players: Array<Maybe<User>>;
  submissions: Array<Maybe<Submission>>;
  topic: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createGame?: Maybe<Game>;
  createUser?: Maybe<User>;
  drawFromPile?: Maybe<Submission>;
  endGame?: Maybe<Scalars['Boolean']>;
  joinGame?: Maybe<User>;
  leaveGame?: Maybe<User>;
  makeSubmission?: Maybe<Submission>;
  startGame?: Maybe<Game>;
  steal?: Maybe<Submission>;
};


export type MutationCreateGameArgs = {
  topic: Scalars['String'];
};


export type MutationCreateUserArgs = {
  name: Scalars['String'];
};


export type MutationJoinGameArgs = {
  gameId: Scalars['String'];
};


export type MutationMakeSubmissionArgs = {
  title: Scalars['String'];
};


export type MutationStealArgs = {
  submissionId: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  game?: Maybe<Game>;
  user?: Maybe<User>;
};

export type Submission = {
  __typename?: 'Submission';
  game: Game;
  id: Scalars['String'];
  pastPossessor: Array<Maybe<User>>;
  possessor?: Maybe<User>;
  submitter: User;
  title: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  currentlyPlaying?: Maybe<Game>;
  id: Scalars['String'];
  name: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Game: ResolverTypeWrapper<Game>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Submission: ResolverTypeWrapper<Submission>;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Game: Game;
  Mutation: {};
  Query: {};
  String: Scalars['String'];
  Submission: Submission;
  User: User;
};

export type GameResolvers<ContextType = any, ParentType extends ResolversParentTypes['Game'] = ResolversParentTypes['Game']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  currentPlayer?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  drawPile?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  host?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  players?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType>;
  submissions?: Resolver<Array<Maybe<ResolversTypes['Submission']>>, ParentType, ContextType>;
  topic?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createGame?: Resolver<Maybe<ResolversTypes['Game']>, ParentType, ContextType, RequireFields<MutationCreateGameArgs, 'topic'>>;
  createUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'name'>>;
  drawFromPile?: Resolver<Maybe<ResolversTypes['Submission']>, ParentType, ContextType>;
  endGame?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  joinGame?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationJoinGameArgs, 'gameId'>>;
  leaveGame?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  makeSubmission?: Resolver<Maybe<ResolversTypes['Submission']>, ParentType, ContextType, RequireFields<MutationMakeSubmissionArgs, 'title'>>;
  startGame?: Resolver<Maybe<ResolversTypes['Game']>, ParentType, ContextType>;
  steal?: Resolver<Maybe<ResolversTypes['Submission']>, ParentType, ContextType, RequireFields<MutationStealArgs, 'submissionId'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  game?: Resolver<Maybe<ResolversTypes['Game']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
};

export type SubmissionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Submission'] = ResolversParentTypes['Submission']> = {
  game?: Resolver<ResolversTypes['Game'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pastPossessor?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType>;
  possessor?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  submitter?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  currentlyPlaying?: Resolver<Maybe<ResolversTypes['Game']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Game?: GameResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Submission?: SubmissionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

