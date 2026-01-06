import 'dotenv/config';
import {defineConfig} from 'drizzle-kit';

export default defineConfig({
  out: './db/migrations/',
  schema: './db/schema/*.ts',
  dialect: process.env.DB_DIALECT as "postgresql" ,
  dbCredentials: {
    url: process.env.DB_URL!,
  },
  casing: "snake_case",
});
