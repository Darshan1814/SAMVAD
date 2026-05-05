const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  try {
    console.log('🔍 Verifying MongoDB Atlas connection and data...');
    const leadsCount = await prisma.lead.count();
    const campaignsCount = await prisma.campaign.count();
    const callsCount = await prisma.call.count();

    console.log('✅ Connection Successful!');
    console.log(`📊 Data Status:`);
    console.log(`- Leads: ${leadsCount}`);
    console.log(`- Campaigns: ${campaignsCount}`);
    console.log(`- Calls: ${callsCount}`);

    if (leadsCount > 0) {
      const latestLead = await prisma.lead.findFirst({
        orderBy: { createdAt: 'desc' },
        include: { campaign: true }
      });
      console.log(`👤 Latest Lead: ${latestLead.name} (${latestLead.campaign?.name || 'No Campaign'})`);
    }

  } catch (error) {
    console.error('❌ Verification Failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
