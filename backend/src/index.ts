import express, { type Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getJwtSecret } from './lib/jwt.js';
import { verifyMailTransport } from './lib/mail.js';

dotenv.config();
getJwtSecret();

const app: Express = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  void verifyMailTransport();
});