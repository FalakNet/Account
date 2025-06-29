import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, url, ip, headers } = req;
  
  // Log request
  console.log(`[${new Date().toISOString()}] ${method} ${url} - IP: ${ip}`);
  
  // Log response time after response is sent
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    
    console.log(
      `[${new Date().toISOString()}] ${method} ${url} - ${statusCode} - ${duration}ms`
    );
    
    // Log errors
    if (statusCode >= 400) {
      console.error(
        `Error response: ${method} ${url} - ${statusCode} - User-Agent: ${headers['user-agent']}`
      );
    }
  });
  
  next();
};
