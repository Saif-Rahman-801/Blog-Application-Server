import express, { NextFunction, Request, Response } from 'express';
import { blockUser, deleteBlogAdmin } from './admin.controller';
import { adminRolecheck, authenticate } from '../auth/auth.middleware';

const router = express.Router();

router.post(
  '/users/:userId/block',
  authenticate,
  adminRolecheck,
  (req: Request, res: Response, next: NextFunction) => {
    blockUser(req, res).catch(next);
  },
);
router.post(
  '/blogs/:id',
  authenticate,
  adminRolecheck,
  (req: Request, res: Response, next: NextFunction) => {
    deleteBlogAdmin(req, res).catch(next);
  },
);

export const adminRoutes = router;
