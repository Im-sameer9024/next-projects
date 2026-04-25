import { prisma } from "../src/shared/lib/prisma";

async function main() {
  try {
    await prisma.category.createMany({
      data: [
        {
          name: "Computer Science",
        },
        {
          name: "Music",
        },
        {
          name: "Fitness",
        },
        {
          name: "Photography",
        },
        {
          name: "Accounting",
        },
        {
          name: "Development",
        },
        {
          name: "Ai",
        },
      ],
    });

    console.log("success");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await prisma.$disconnect();
  }
}
main();