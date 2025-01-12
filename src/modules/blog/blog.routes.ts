import express, { NextFunction, Request, Response } from 'express';
import { createBlog, deleteBlog, updateBlog } from './blog.controller';
import { authenticate, userRolecheck } from '../auth/auth.middleware';

const router = express.Router();

router.post(
  '/',
  authenticate,
  userRolecheck,
  (req: Request, res: Response, next: NextFunction) => {
    createBlog(req, res).catch(next);
  },
);

router.get(
  '/',
  authenticate,
  userRolecheck,
  (req: Request, res: Response, next: NextFunction) => {
    createBlog(req, res).catch(next);
  },
);

router.patch(
  '/:id',
  authenticate,
  userRolecheck,
  (req: Request, res: Response, next: NextFunction) => {
    updateBlog(req, res).catch(next);
  },
);

router.delete(
  '/:id',
  authenticate,
  userRolecheck,
  (req: Request, res: Response, next: NextFunction) => {
    deleteBlog(req, res).catch(next);
  },
);

export const blogRoutes = router;
