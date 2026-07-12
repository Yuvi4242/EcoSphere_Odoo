import { PrismaClient } from '@prisma/client/index.js';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.training.count();
  if (count > 0) {
    console.log('Trainings already seeded');
    return;
  }

  const deptCount = await prisma.department.count();
  if (deptCount === 0) {
    const defaultDepts = ['Manufacturing', 'Engineering', 'Sales', 'Finance', 'HR', 'Logistics'];
    await prisma.department.createMany({
      data: defaultDepts.map(name => ({ name, code: name.slice(0, 3).toUpperCase() }))
    });
  }

  const defaultTrainings = [
    { title: 'Anti-Bribery & Corruption', description: 'Mandatory annual compliance' },
    { title: 'Waste Sorting Basics', description: 'Office environmental policy' },
    { title: 'Advanced ESG Reporting', description: 'For finance and engineering' },
  ];

  await prisma.training.createMany({ data: defaultTrainings });
  console.log('Successfully seeded default trainings');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
