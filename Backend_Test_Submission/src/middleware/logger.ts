import { Log } from 'logging_middleware';
import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  Log('backend', 'info', 'router', `Incoming ${req.method} ${req.url}`);
  next();
};
