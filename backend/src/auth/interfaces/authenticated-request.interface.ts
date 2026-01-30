import { Request } from 'express';
import { UserRole } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  institutionId?: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
