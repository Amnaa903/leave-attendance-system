const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('User Balances:');
  for (const u of users) {
    console.log(`User: ${u.email}, WFH Balance: ${u.work_from_home_balance}`);
    
    // Fix if undefined or strangely 0 (if default failed)
    if (u.work_from_home_balance === undefined || u.work_from_home_balance === null) {
        console.log('Fixing balance for', u.email);
        await prisma.user.update({
            where: { id: u.id },
            data: { work_from_home_balance: 5 }
        });
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
