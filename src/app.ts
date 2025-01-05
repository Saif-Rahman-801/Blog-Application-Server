import express from 'express';
import cors from 'cors';
import { authRoutes } from './modules/auth/auth.routes';


const app = express();

// perser
app.use(express.json());
app.use(cors());

// App routes
app.use('/api/auth', authRoutes);
// app.use('/api/orders', );

app.get('/', (req, res) => {
  res.send('Welcome to the Blogging Store API!');
});

export default app;