import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  mongoStatUrl: process.env.MONGO_URI || process.env.MONGODB_URI,
}));
