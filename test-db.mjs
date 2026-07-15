import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

const url = "libsql://avorex-e-commarce-website-wahid-mozammelhaquexo.aws-ap-south-1.turso.io";
const token = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODQxNTQzMTksImlkIjoiMDE5ZjY3OWQtNzMwMS03ZTYxLThjMDYtMDllOGFhMTQyYzVjIiwia2lkIjoic055WDN2MUw4TWtzcERwYlJvSUNTY3VYcG9fSGtscC1RYlNqclRLZWFBUSIsInJpZCI6IjUyYWUyM2RjLTEzYzMtNDRkNC1iOGEyLTBkZjFjYjBjYTdjYyJ9.xwA99c3iiYzQ7ST2kpfUJEAvHoiyyRSLUqaVY4k53Afn6o2KI7wmpJYN0vKIB5GKTtL1UthF_3Lu9QBy0CsYAA";

try {
  const adapter = new PrismaLibSql({ url, authToken: token });
  const prisma = new PrismaClient({ adapter });
  const r = await prisma.$queryRawUnsafe("SELECT 1 as test");
  console.log("Result:", r);
  console.log("SUCCESS - NEW TOKEN WORKS!");
  await prisma.$disconnect();
} catch (e) {
  console.error("FAIL:", e);
}
