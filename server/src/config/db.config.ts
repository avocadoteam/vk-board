import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  mongoStatUrl: process.env.MONGO_URI || process.env.MONGODB_URI,
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  dbName: process.env.PG_NAME,
}));
