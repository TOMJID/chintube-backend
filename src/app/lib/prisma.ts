import "dotenv/config";

import { PrismaClient } from "@orm/generated/prisma-client/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { envConfig } from "../config/env.config";

const connectionString = `${envConfig.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
