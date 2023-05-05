import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  const user = await prisma.user.createMany({
    data: [
      {
        age: 20,
        name: 'Bobby',
        email: 'bobbypaladin@gmail.com',
        password: '12345678',
      },
      {
        age: 27,
        name: 'John',
        email: 'johndoe@gmail.com',
        password: '12345678',
      },
    ],
  });
  console.log(user);
}

main()
  .catch((e) => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
