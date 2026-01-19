import { PrismaClient } from '../src/generated/prisma';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as bcrypt from 'bcrypt';

async function main() {
  const prisma = new PrismaClient({
    adapter: new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
    }),
  });

  try {
    console.log('Creating password hash...');
    const password = 'admin123';
    const adminPassword = await bcrypt.hash(password, 10);
    
    console.log('Password:', password);
    console.log('Hash:', adminPassword);
    
    // Test the hash immediately
    const testMatch = await bcrypt.compare(password, adminPassword);
    console.log('Hash test (should be true):', testMatch);

    // Use upsert to avoid duplicates
    const admin = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {
        passwordHash: adminPassword,
        role: 'ADMIN',
        isActive: true,
      },
      create: {
        username: 'admin',
        passwordHash: adminPassword,
        role: 'ADMIN',
        isActive: true,
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('Username:', admin.username);
    console.log('Password: admin123');
    console.log('Role:', admin.role);
    console.log('ID:', admin.id);
    
    // Verify by fetching and testing
    const fetchedUser = await prisma.user.findUnique({
      where: { username: 'admin' },
    });
    
    if (fetchedUser) {
      const passwordCheck = await bcrypt.compare('admin123', fetchedUser.passwordHash);
      console.log('✅ Verification check (should be true):', passwordCheck);
    }
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });