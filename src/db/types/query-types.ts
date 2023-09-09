import {Request} from "express";

export type RequestQueryParams<Q> = Request<{}, {}, {}, Q>