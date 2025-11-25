import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { v4 as uuid } from 'uuid';
import { hashPassword } from 'better-auth/crypto';
import { user, session, account } from './schema/auth';
import {
  trips,
  tripLocations,
  tripDays,
  tripDayNotes,
  tripTransports,
  tripUsers,
} from './schema/trip';

if (process.env.NODE_ENV === 'production') {
  console.error('❌ Cannot run seed in production environment');
  process.exit(1);
}

const db = drizzle(process.env.DATABASE_URL!);

async function seed() {
  console.log('🌱 Seeding database...');

  const testUser1 = {
    id: uuid(),
    name: 'John Doe',
    email: 'john@example.com',
    emailVerified: true,
    image: null,
  };

  const testUser2 = {
    id: uuid(),
    name: 'Jane Smith',
    email: 'jane@example.com',
    emailVerified: true,
    image: null,
  };

  await db.insert(user).values([testUser1, testUser2]);
  console.log('✅ Created users');

  const testPassword = 'Password123';
  const hashedPassword = await hashPassword(testPassword);

  await db.insert(account).values({
    id: uuid(),
    accountId: testUser1.id,
    providerId: 'credential',
    userId: testUser1.id,
    password: hashedPassword,
  });
  console.log('✅ Created account credentials');

  const sessionToken = uuid();
  await db.insert(session).values({
    id: uuid(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    token: sessionToken,
    userId: testUser1.id,
    ipAddress: '127.0.0.1',
    userAgent: 'Seed Script',
  });
  console.log('✅ Created session');

  const trip1 = {
    id: uuid(),
    ownerId: testUser1.id,
    title: 'Summer in Europe',
    description:
      'A wonderful trip through Western Europe visiting major cities.',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-07-15'),
    duration: 15,
    distance: 2500.5,
    visibility: 'public' as const,
    status: 'active' as const,
  };

  const trip2 = {
    id: uuid(),
    ownerId: testUser1.id,
    title: 'Weekend Getaway',
    description: 'Quick weekend trip to the mountains.',
    startDate: new Date('2024-08-10'),
    endDate: new Date('2024-08-12'),
    duration: 3,
    distance: 350.0,
    visibility: 'private' as const,
    status: 'active' as const,
  };

  const trip3 = {
    id: uuid(),
    ownerId: testUser2.id,
    title: 'Business Trip',
    description: 'Conference attendance in San Francisco.',
    startDate: new Date('2024-09-05'),
    endDate: new Date('2024-09-08'),
    duration: 4,
    distance: 800.0,
    visibility: 'private' as const,
    status: 'active' as const,
  };

  await db.insert(trips).values([trip1, trip2, trip3]);
  console.log('✅ Created trips');

  await db.insert(tripLocations).values([
    {
      id: uuid(),
      tripId: trip1.id,
      name: 'Paris',
      address: 'Paris, France',
      country: 'France',
      city: 'Paris',
      lon: 2.3522,
      lat: 48.8566,
      type: 'start',
    },
    {
      id: uuid(),
      tripId: trip1.id,
      name: 'Amsterdam',
      address: 'Amsterdam, Netherlands',
      country: 'Netherlands',
      city: 'Amsterdam',
      lon: 4.9041,
      lat: 52.3676,
      type: 'stop',
      stopIndex: 1,
    },
    {
      id: uuid(),
      tripId: trip1.id,
      name: 'Berlin',
      address: 'Berlin, Germany',
      country: 'Germany',
      city: 'Berlin',
      lon: 13.405,
      lat: 52.52,
      type: 'end',
    },
  ]);
  console.log('✅ Created trip locations');

  const day1 = {
    id: uuid(),
    tripId: trip1.id,
    title: 'Arrival in Paris',
    dayNumber: 1,
  };
  const day2 = {
    id: uuid(),
    tripId: trip1.id,
    title: 'Exploring Paris',
    dayNumber: 2,
  };
  const day3 = {
    id: uuid(),
    tripId: trip1.id,
    title: 'Travel to Amsterdam',
    dayNumber: 3,
  };

  await db.insert(tripDays).values([day1, day2, day3]);
  console.log('✅ Created trip days');

  await db.insert(tripDayNotes).values([
    {
      id: uuid(),
      tripDayId: day1.id,
      tripId: trip1.id,
      userId: testUser1.id,
      text: 'Arrived at CDG airport. Checked into hotel near Montmartre. Had amazing croissants for breakfast!',
    },
    {
      id: uuid(),
      tripDayId: day2.id,
      tripId: trip1.id,
      userId: testUser1.id,
      text: 'Visited the Louvre and Eiffel Tower. The views from the top were breathtaking.',
    },
  ]);
  console.log('✅ Created trip day notes');

  await db.insert(tripTransports).values([
    { id: uuid(), tripId: trip1.id, tripDayId: day1.id, type: 'plane' },
    { id: uuid(), tripId: trip1.id, tripDayId: day2.id, type: 'on_foot' },
    { id: uuid(), tripId: trip1.id, tripDayId: day3.id, type: 'train' },
  ]);
  console.log('✅ Created trip transports');

  await db.insert(tripUsers).values({
    id: uuid(),
    tripId: trip1.id,
    userId: testUser2.id,
    role: 'editor',
    addedBy: testUser1.id,
  });
  console.log('✅ Created trip collaborators');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\nTest credentials:');
  console.log('  Email: john@example.com');
  console.log(`  Password: ${testPassword}`);
  console.log(`  Session token: ${sessionToken}`);

  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
