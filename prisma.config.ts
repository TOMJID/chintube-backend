import "dotenv/config";

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./src/app/orm/prisma/schema.prisma",
  migrations: {
    path: "./src/app/orm/prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
