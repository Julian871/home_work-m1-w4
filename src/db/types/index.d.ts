import {userTypeOutput} from "./user-types";
import {connectType} from "./connect-types";

export declare global {namespace Express {export interface Request {user: userTypeOutput | null  }  }}

export declare global {namespace Express {export interface Request {connectInfo: connectType}  }}