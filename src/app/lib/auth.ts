import { prismaAdapter } from "better-auth/adapters/prisma";
import { Role } from "@orm/generated/prisma-client/enums";
import { betterAuth } from "better-auth";

import { prisma } from "./prisma";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: Role.USER,
      },
    },
  },
});
