import { Prisma, PrismaClient } from "@prisma/client";
import { randomInt, randomUUID } from "crypto";
const prisma = new PrismaClient();
async function main() {
  console.log("Deleting old stuff...");
  await prisma.user.deleteMany({ where: { role: { not: "ADMIN" } } });
  await prisma.user.deleteMany({ where: { name: "Seeded Test User" } });
  await prisma.survey.deleteMany();
  await prisma.family.deleteMany();
  await prisma.survey.deleteMany();
  await prisma.response.deleteMany();
  await prisma.subOrganization.deleteMany();
  await prisma.organization.deleteMany();

  console.log("Creating new Org...");
  const testOrg = await prisma.organization.create({
    data: {
      name: "Seeded Test Org",
    },
  });

  const subOrg1 = await prisma.subOrganization.create({
    data: {
      name: "Sub 1",
      organization: { connect: { id: testOrg.id } },
    },
  });

  const subOrg2 = await prisma.subOrganization.create({
    data: {
      name: "Sub 2",
      organization: { connect: { id: testOrg.id } },
    },
  });

  console.log("Crating new users...");

  const testUser1 = await prisma.user.create({
    data: {
      name: "Seeded Test User",
      email: "test0@example.com",
      authId: randomUUID(),
      organization: { connect: { id: testOrg.id } },
      subOrganizations: { connect: { id: subOrg1.id } },
      role: "ADMIN",
    },
  });
  const testUser2 = await prisma.user.create({
    data: {
      name: "Seeded Test User",
      email: "test1@example.com",
      authId: randomUUID(),
      organization: { connect: { id: testOrg.id } },
      subOrganizations: { connect: { id: subOrg1.id } },
    },
  });
  const testUser3 = await prisma.user.create({
    data: {
      name: "Seeded Test User",
      email: "test2@example.com",
      authId: randomUUID(),
      organization: { connect: { id: testOrg.id } },
      subOrganizations: { connect: { id: subOrg2.id } },
    },
  });
  const testUser4 = await prisma.user.create({
    data: {
      name: "Seeded Test User",
      email: "test3@example.com",
      authId: randomUUID(),
      organization: { connect: { id: testOrg.id } },
      subOrganizations: { connect: { id: subOrg2.id } },
    },
  });

  const users = [testUser1, testUser2, testUser3, testUser4];

  function randomUser() {
    return users[randomInt(0, 3)];
  }

  console.log("Generating Dates...");
  function randomDates(start: Date, end: Date, n: number) {
    let res: Date[] = [];
    for (let i = 0; i < n; i++) {
      res.push(
        new Date(
          start.getTime() + Math.random() * (end.getTime() - start.getTime())
        )
      );
    }
    return res;
  }

  let dates = randomDates(new Date("1/1/2024"), new Date("6/30/2024"), 100);

  console.log("Creating Families...");
  const families = await prisma.family.createMany({
    data: dates.map<Prisma.FamilyCreateManyInput>((d) => ({
      beginOfCare: d,
      userId: randomUser().id,
    })),
  });

  console.log("Creating a survey...");
  const survey = await prisma.survey.create({
    data: {
      name: "seeded-testing-survey",
      createdBy: { connect: { id: testUser1.id } },
      hasFamily: true,
    },
  });

  const questionsCreate = await prisma.question.createMany({
    data: [
      {
        surveyId: survey.id,
        type: "Text",
        questionText: "0",
        numberInSurvey: 0,
      },
      {
        type: "Bool",
        questionText: "1",
        surveyId: survey.id,
        numberInSurvey: 1,
        defaultAnswerBool: true,
      },
      {
        type: "Int",
        questionText: "2",
        surveyId: survey.id,
        numberInSurvey: 2,
        intRange: true,
        intRangeLow: 0,
        intRangeHigh: 10,
      },
      {
        type: "Date",
        questionText: "3",
        surveyId: survey.id,
        numberInSurvey: 3,
        required: true,
      },
    ],
  });

  const createdFamilies = await prisma.family.findMany();
  const questions = await prisma.question.findMany({
    where: { surveyId: survey.id },
  });

  console.log("Creating Response Input...");
  let answers: Prisma.ResponseCreateInput[] = [];
  for (let i = 0; i < 500; i++) {
    answers.push({
      survey: { connect: { id: survey.id } },
      family: {
        connect: {
          id: createdFamilies[randomInt(0, createdFamilies.length - 1)].id,
        },
      },
      answers: {
        createMany: {
          data: [
            {
              questionId: questions[0].id,
              answerText: randomUUID(),
            },
            {
              questionId: questions[1].id,
              answerBool: randomInt(1) === 0,
            },
            {
              questionId: questions[2].id,
              answerInt: randomInt(1, 11),
            },
            {
              questionId: questions[3].id,
              answerDate: dates[randomInt(0, 99)],
            },
          ],
        },
      },
    });
  }

  console.log("Creating Responses...");
  for (let index = 0; index < answers.length; index++) {
    await prisma.response.create({ data: answers[index] });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

