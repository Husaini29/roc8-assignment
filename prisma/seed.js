import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker"

const prisma = new PrismaClient();

async function main() {
  const categories = [];

  while (categories.length < 100) {
    categories.push(faker.commerce.department());
  }

  console.log('100 unique categories have been added to the database.',categories);

  const categoryData = categories.map(name => ({ name }));

  await prisma.category.createMany({
    data: categoryData,
    skipDuplicates:true
  });

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
