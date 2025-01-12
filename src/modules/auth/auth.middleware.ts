import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';

interface AuthRequest extends Request {
  user?: IUser;
}

interface DecodedToken {
  id: string;
}

const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'secret',
      ) as DecodedToken;
      // console.log(decoded);

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        res
          .status(404)
          .json({ success: false, message: 'User not found', statusCode: 404 });
        return;
      }
      // console.log(user);

      req.user = user;
      next();
    } catch (error) {
      res.status(403).json({
        success: false,
        message: 'Invalid token',
        statusCode: 403,
        error,
      });
    }
  } else {
    res
      .status(401)
      .json({ success: false, message: 'No token provided', statusCode: 401 });
  }
};

const adminRolecheck = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = req.user;
    if (!user || user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        statusCode: 403,
        message: 'Forbidden: Admin access required',
      });
    }

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid token',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'Unknown error',
    });
  }
};
const userRolecheck = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = req.user;
    if (!user || user?.role !== 'user') {
      res.status(403).json({
        success: false,
        statusCode: 403,
        message: 'Forbidden: user access required',
      });
    }

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid token',
      statusCode: 401,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'Unknown error',
    });
  }
};

export { authenticate, adminRolecheck, userRolecheck };
