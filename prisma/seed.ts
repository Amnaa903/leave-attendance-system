import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const { hash } = bcrypt

const prisma = new PrismaClient()

async function main() {
  const password = await hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      email: 'admin@company.com',
      name: 'Admin User',
      password,
      role: 'admin',
      employee_id: 'ADM001',
      department: 'IT',
      position: 'Administrator',
      join_date: new Date(),
    },
  })

  console.log({ admin })

  // Optional: Create a manager and employee for testing
  const mgrPassword = await hash('manager123', 10)
  const manager = await prisma.user.upsert({
    where: { email: 'manager@company.com' },
    update: {},
    create: {
      email: 'manager@company.com',
      name: 'Manager User',
      password: mgrPassword,
      role: 'manager',
      employee_id: 'MGR001',
      department: 'HR',
      position: 'HR Manager',
      join_date: new Date(),
    },
  })
  console.log({ manager })

  const empPassword = await hash('employee123', 10)
  const employee = await prisma.user.upsert({
    where: { email: 'employee@company.com' },
    update: {},
    create: {
      email: 'employee@company.com',
      name: 'John Employee',
      password: empPassword,
      role: 'employee',
      employee_id: 'EMP001',
      department: 'Engineering',
      position: 'Developer',
      join_date: new Date(),
    },
  })
  console.log({ employee })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })