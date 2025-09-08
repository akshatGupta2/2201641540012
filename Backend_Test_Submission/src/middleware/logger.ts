import { Logger } from '../../../Logging_Middleware/src/logger'; // Replace with actual import

export const requestLogger = (req: Request, res: Response, next: Function) => {
  Logger('backend', 'info', 'router', `Incoming ${req.method} ${req.url}`);
  next();
};
