export function getContextRequest(userId?: string): any {
  return {
    req: {
      headers: {
        authorization: userId,
      },
    },
  };
}
