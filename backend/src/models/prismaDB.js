import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const User = prisma.users;
const FriendList = prisma.friendList;
const Friends = prisma.friends;
const Notification = prisma.notification;
export const Models = {
  User,
  FriendList,
  Friends,
  Notification,
  prisma,
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
