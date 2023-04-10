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
  FRIEND_REQUEST: 'FRIEND-REQUEST',
  FRIEND_ADD: 'FRIEND-ADDED',
  FRIEND_DELETE: 'FRIEND-DELETED',
  POST: 'POST',
  STORY: 'STORY',
  MESSAGE: 'MESSAGE',
};
Object.freeze(notificationType);
export { HttpMethods, SocialStatus, notificationType };
