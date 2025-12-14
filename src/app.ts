import express from 'express';
import dotenv from 'dotenv';
import questRoutes from './routes/questRoutes';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import random from "crypto"
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(cors())
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true, 
  legacyHeaders: false,  
});


app.use(limiter);

app.post("/api/token/generate", async (req, res)  => {
    const token = jwt.sign(
    { nonce: random.randomUUID() },
    process.env.JWT_SECRET!,
    { expiresIn: '1m' } 
  );

  res.status(200).json({ token });
})

app.use((req, res, next) => {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token faltante' });
  }

  const token = auth.split(' ')[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    next(); 
  } catch {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
});



app.use('/api/quest', questRoutes);

export default app;