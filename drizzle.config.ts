import { config } from '@dotenvx/dotenvx';
import {defineConfig} from 'drizzle-kit';

config({ override: true });

export default defineConfig({
  out: './db/migrations/',
  schema: './db/schema/*.ts',
  dialect: process.env.DB_DIALECT as "postgresql" ,
  dbCredentials: {
    url: process.env.DB_URL!,
  },
  casing: "snake_case",
});
