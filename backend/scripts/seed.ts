import { prisma } from '../src/services/prisma';
import bcrypt from 'bcrypt';

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@test.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      riotGameName: 'admin',
      riotGameTag: 'admin',
      region: 'VN',
      balance: { create: { amount: 1000000 } }
    }
  });
  console.log('Seeded admin user:', admin);

  // Seed 16 regular users
  const users = [];
  for (let i = 1; i <= 16; i++) {
    const username = `user${i}`;
    const email = `user${i}@test.com`;
    const user = await prisma.user.upsert({
      where: { email: email },
      update: {},
      create: {
        username: username,
        email: email,
        password: await bcrypt.hash('user123', 10),
        role: 'user',
        riotGameName: `game${username}`,
        riotGameTag: `tag${username}`,
        region: 'VN',
        balance: { create: { amount: 500000 } }
      }
    });
    users.push(user);
  }
  console.log(`Seeded ${users.length} regular users.`, users.map(u => u.email));
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); }); 