import {userTypeOutput} from "./user-types";
import {connectType} from "./sessions-type";

export declare global {namespace Express {export interface Request {user: userTypeOutput | null  }  }}

export declare global {namespace Express {export interface Request {deviceId: string }  }}