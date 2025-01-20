declare module 'cookie-parse';
declare namespace Express {
  export interface Request {
    user?: {
      fullname: string;
      sub: string;
    };
  }
}
