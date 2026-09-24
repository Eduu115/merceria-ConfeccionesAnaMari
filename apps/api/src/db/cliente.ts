import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { config } from '../config.js';
import * as esquema from './esquema.js';

const sql = postgres(config.databaseUrl, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 30,
});

export const db = drizzle(sql, { schema: esquema });
export { sql };
