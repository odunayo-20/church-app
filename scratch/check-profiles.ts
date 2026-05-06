import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  const profiles = await prisma.profile.findMany();
  console.log(JSON.stringify(profiles, null, 2));
  await prisma.$disconnect();
}

main();
