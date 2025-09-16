import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
}
declare global {
  namespace Express {
    interface Request {
      userId?: string; 
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1]; 
  if (!token) return res.status(401).json({ message: 'Invalid token' });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as JwtPayload;
    req.userId = decoded.id; 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
