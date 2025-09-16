import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  email: string
  name: string
}
declare global {
  namespace Express {
    interface Request {
      userId?: string; 
      userEmail?: string
      username?: string
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
    console.log(decoded);
    
    req.userId = decoded.id; 
    req.userEmail = decoded.email
    req.username = decoded.name

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
