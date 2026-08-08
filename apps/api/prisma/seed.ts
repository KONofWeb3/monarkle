import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hash(pw: string) {
  return bcrypt.hash(pw, 10);
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

async function main() {
  console.log('Seeding database...');

  // Wipe existing data (dev only)
  await prisma.stop.deleteMany();
  await prisma.route.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.rewardEntry.deleteMany();
  await prisma.pickup.deleteMany();
  await prisma.bankAccount.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.pspProfile.deleteMany();
  await prisma.collectorProfile.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = await hash('password123');

  // ---------- Admin ----------
  const admin = await prisma.user.create({
    data: {
      role: 'ADMIN',
      fullName: 'Ops Admin',
      email: 'ops@monarkle.africa',
      passwordHash: defaultPassword,
      avatarInitials: 'OA',
      city: 'Lagos',
    },
  });

  // ---------- Households ----------
  const household = await prisma.user.create({
    data: {
      role: 'HOUSEHOLD',
      fullName: 'Chukwuemeka Okafor',
      phone: '+2348012345678',
      email: 'chuk.okafor@example.com',
      passwordHash: defaultPassword,
      avatarInitials: 'CO',
      accountType: 'Household',
      city: 'Lagos',
      referralCode: 'EMEKA-7K2P',
      wallet: { create: { balance: 0 } },
      bankAccounts: { create: { bankName: 'GTBank', accountNumber: '0234567890', accountName: 'Chukwuemeka Okafor' } },
    },
  });

  const household2 = await prisma.user.create({
    data: {
      role: 'HOUSEHOLD',
      fullName: 'Amaka Nwosu',
      phone: '+2348063334455',
      email: 'amaka.n@example.com',
      passwordHash: defaultPassword,
      avatarInitials: 'AN',
      accountType: 'Household',
      city: 'Abuja',
      status: 'PENDING',
      referralCode: 'AMAKA-3X9L',
      wallet: { create: { balance: 0 } },
    },
  });

  // ---------- PSPs ----------
  const psp = await prisma.user.create({
    data: {
      role: 'PSP',
      fullName: 'John Doe (EcoTransit)',
      phone: '+2348023456789',
      email: 'ops@ecotransit.ng',
      passwordHash: defaultPassword,
      avatarInitials: 'JD',
      city: 'Lagos',
      wallet: { create: { balance: 0 } },
      pspProfile: {
        create: { vehicleType: 'EcoTransit Van', plateNumber: 'LND-442-KJ', rating: 4.8, totalJobs: 0, verified: true },
      },
    },
  });

  const pspSuspended = await prisma.user.create({
    data: {
      role: 'PSP',
      fullName: 'CleanCity Recyclers',
      phone: '+2348074445566',
      email: 'dispatch@cleancity.ng',
      passwordHash: defaultPassword,
      avatarInitials: 'CC',
      city: 'Abuja',
      status: 'SUSPENDED',
      wallet: { create: { balance: 0 } },
      pspProfile: { create: { vehicleType: 'CleanCity Truck', plateNumber: 'ABJ-221-CC', rating: 4.2, totalJobs: 88, verified: true } },
    },
  });

  // ---------- Collector ----------
  const collector = await prisma.user.create({
    data: {
      role: 'COLLECTOR',
      fullName: 'Michael Eze',
      phone: '+2348034567890',
      email: 'm.eze@ecotransit.ng',
      passwordHash: defaultPassword,
      avatarInitials: 'ME',
      city: 'Lagos',
      wallet: { create: { balance: 0 } },
      collectorProfile: {
        create: {
          vehicleType: 'MONARKLE Collection Truck',
          plateNumber: 'LND-118-XY',
          licenseNumber: 'DVL-88213-LG',
          totalRoutes: 0,
          verified: true,
        },
      },
    },
  });

  // ---------- Recycler / Corporate (admin user list only) ----------
  await prisma.user.create({
    data: {
      role: 'RECYCLER',
      fullName: 'GreenCity Recyclers',
      email: 'contact@greencity.ng',
      phone: '+2348041112233',
      passwordHash: defaultPassword,
      avatarInitials: 'GR',
      city: 'Lagos',
    },
  });
  await prisma.user.create({
    data: {
      role: 'CORPORATE',
      fullName: 'Unilever Nigeria',
      email: 'esg@unilever.ng',
      phone: '+2348052223344',
      passwordHash: defaultPassword,
      avatarInitials: 'UN',
      city: 'Lagos',
    },
  });

  // ---------- Pickups ----------
  const completedDispose = await prisma.pickup.create({
    data: {
      code: 'PK-4021',
      householdId: household.id,
      intent: 'DISPOSE',
      category: 'Plastic',
      quantity: 'Medium',
      weightKg: 12,
      address: '14 Admiralty Way, Lekki Phase 1',
      city: 'Lagos',
      scheduledDate: 'Jul 8, 2026',
      scheduledTime: 'Morning',
      status: 'COMPLETED',
      serviceFee: 1500,
      netPayout: 2774,
      pspId: psp.id,
      completedAt: new Date(),
    },
  });
  await prisma.payout.create({
    data: { userId: psp.id, pickupId: completedDispose.id, amount: 2774, status: 'PAID' },
  });
  await prisma.rewardEntry.create({
    data: { userId: household.id, label: `Pickup #${completedDispose.code} completed`, points: 50 },
  });

  await prisma.pickup.create({
    data: {
      code: 'PK-4022',
      householdId: household.id,
      intent: 'SELL',
      category: 'Metal',
      quantity: 'Small',
      weightKg: 8,
      address: '14 Admiralty Way, Lekki Phase 1',
      city: 'Lagos',
      scheduledDate: 'Jul 8, 2026',
      scheduledTime: 'Afternoon',
      status: 'IN_PROGRESS',
      pspId: psp.id,
    },
  });

  await prisma.pickup.create({
    data: {
      code: 'PK-4024',
      householdId: household2.id,
      intent: 'DISPOSE',
      category: 'E-waste',
      quantity: 'Medium',
      address: '5 Glover Rd, Ikoyi',
      city: 'Lagos',
      scheduledDate: 'Jul 7, 2026',
      scheduledTime: 'Morning',
      status: 'ASSIGNED',
      serviceFee: 1500,
      pspId: psp.id,
    },
  });

  const pendingJob = await prisma.pickup.create({
    data: {
      code: 'PK-4025',
      householdId: household2.id,
      intent: 'DISPOSE',
      category: 'Organic',
      quantity: 'Large',
      address: '3 Ahmadu Bello Way',
      city: 'Abuja',
      scheduledDate: 'Today',
      scheduledTime: 'Morning',
      status: 'PENDING',
      serviceFee: 1500,
    },
  });

  // Pickups pre-assigned to the collector, forming today's route.
  const stop1Pickup = await prisma.pickup.create({
    data: {
      code: 'PK-3011',
      householdId: household.id,
      intent: 'DISPOSE',
      category: 'Plastic',
      quantity: 'Medium',
      address: '14 Admiralty Way, Lekki Phase 1',
      city: 'Lagos',
      scheduledDate: todayStr(),
      scheduledTime: 'Morning',
      status: 'ASSIGNED',
      serviceFee: 1500,
      collectorId: collector.id,
    },
  });
  const stop2Pickup = await prisma.pickup.create({
    data: {
      code: 'PK-3012',
      householdId: household2.id,
      intent: 'DISPOSE',
      category: 'Metal',
      quantity: 'Small',
      address: '9 Freedom Way, Lekki Phase 1',
      city: 'Lagos',
      scheduledDate: todayStr(),
      scheduledTime: 'Afternoon',
      status: 'ASSIGNED',
      serviceFee: 1500,
      collectorId: collector.id,
    },
  });

  const route = await prisma.route.create({
    data: { collectorId: collector.id, date: todayStr(), status: 'NOT_STARTED' },
  });
  await prisma.stop.create({ data: { routeId: route.id, pickupId: stop1Pickup.id, sequence: 1, status: 'PENDING' } });
  await prisma.stop.create({ data: { routeId: route.id, pickupId: stop2Pickup.id, sequence: 2, status: 'PENDING' } });

  console.log('Seed complete.');
  console.log('---');
  console.log('Login credentials (password for all: "password123"):');
  console.log(`  Admin:      ${admin.email}`);
  console.log(`  Household:  ${household.phone}`);
  console.log(`  PSP:        ${psp.phone}`);
  console.log(`  Collector:  ${collector.phone}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
