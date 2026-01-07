import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Delete existing data
  await prisma.user.deleteMany()
  console.log('🧹 Cleared existing users')

  const currentDate = new Date()

  // Create test users with join_date
  const admin = await prisma.user.create({
    data: {
      email: 'admin@company.com',
      name: 'System Admin',
      password: 'admin123',
      role: 'ADMIN',
      join_date: currentDate,
    },
  })

  const manager = await prisma.user.create({
    data: {
      email: 'manager@company.com',
      name: 'Department Manager',
      password: 'manager123',
      role: 'MANAGER',
      join_date: currentDate,
    },
  })

  const employee = await prisma.user.create({
    data: {
      email: 'employee@company.com',
      name: 'Regular Employee',
      password: 'employee123',
      role: 'EMPLOYEE',
      join_date: currentDate,
    },
  })

  console.log('✅ Created users:')
  console.log('   - Admin:', admin.email)
  console.log('   - Manager:', manager.email)
  console.log('   - Employee:', employee.email)
  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })