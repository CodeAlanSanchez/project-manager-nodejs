import { Request } from 'express';
import { Session } from 'express-session';

export type MyRequest = Request & { session: Session & { userId?: number } };
