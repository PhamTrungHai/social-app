const HttpMethods = {
  GET: Symbol('GET'),
  POST: Symbol('POST'),
  PUT: Symbol('PUT'),
  DELETE: Symbol('DELETE'),
};
Object.freeze(HttpMethods);
const SocialStatus = {
  requested: 'requested',
  requesting: 'requesting',
  friend: 'friend',
  following: 'following',
  followed: 'followed',
};
Object.freeze(SocialStatus);
const notificationType = {
  FRIEND_REQUESTED: 'FRIEND-REQUESTED',
  FRIEND_ACCEPTED: 'FRIEND-ACCEPTED',
  FRIEND_ADDED: 'FRIEND-ADDED',
  FRIEND_DELETED: 'FRIEND-DELETED',
  POST_LIKE: 'POST-LIKE',
  POST_COMMENT: 'POST-COMMENT',
  STORY: 'STORY',
  MESSAGE: 'MESSAGE',
};
Object.freeze(notificationType);
export { HttpMethods, SocialStatus, notificationType };
