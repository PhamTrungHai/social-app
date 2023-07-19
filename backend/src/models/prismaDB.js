import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  errorFormat: 'minimal',
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
});
prisma.$on('query', (e) => {
  console.log('Query: ' + e.query);
  console.log('Params: ' + e.params);
  console.log('Duration: ' + e.duration + 'ms');
});

const User = prisma.users;
const FriendList = prisma.friendList;
const Friends = prisma.friends;
const Notification = prisma.notification;
const SessionStore = prisma.sessionStore;
const Post = prisma.posts;
const Comment = prisma.comments;
const Like = prisma.likes;
const Message = prisma.messages;
export const Models = {
  User,
  FriendList,
  Friends,
  Notification,
  prisma,
  SessionStore,
  Post,
  Comment,
  Like,
  Message,
};
// function Execute(...funcs) {
//   for (const func of funcs) {
//     func()
//       .then(async () => {
//         console.log('exit');
//         await prisma.$disconnect();
//       })
//       .catch(async (e) => {
//         console.error(e);
//         await prisma.$disconnect();
//         process.exit(1);
//       });
//   }
// }

// export { Execute };
