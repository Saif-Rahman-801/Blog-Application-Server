import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.MONGO_URI,
  JWT_EXPIRATION: "1d",
  JWT_SECRET: process.env.JWT_SECRET
};