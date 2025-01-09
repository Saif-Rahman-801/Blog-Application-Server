import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { authRoutes } from './modules/auth/auth.routes';
import { userRoutes } from './modules/user/user.routes';
import authenticate from './modules/auth/auth.middleware';
import { blogRoutes } from './modules/blog/blog.routes';


const app = express();

// perser
app.use(express.json());
app.use(cors());

// App routes
app.use('/api/auth', authRoutes);
app.use('/api/users',authenticate ,userRoutes);
app.use('/api/blogs',blogRoutes);
// app.use('/api/orders', );

app.get('/', (req, res) => {
  res.send('Welcome to the Blogging app API!');
});

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;