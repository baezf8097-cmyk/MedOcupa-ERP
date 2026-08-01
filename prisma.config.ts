import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://medocupa_user:MedOcupaPass2026!@localhost:5432/medocupa_prod?schema=public',
  },
});
