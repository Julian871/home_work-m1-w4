import {userTypeOutput} from "./user-types";

export declare global {namespace Express {export interface Request {user: userTypeOutput | null  }  }}

export declare global {namespace Express {export interface Request {device_id: string | null  }  }}