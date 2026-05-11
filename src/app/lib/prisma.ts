import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../orm/generated/prisma-client/client";
import { envConfig } from "../config/env.config";

const connectionString = `${envConfig.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
