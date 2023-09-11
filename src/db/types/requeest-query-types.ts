import {Request} from "express";

export type RequestQueryParams<Q> = Request<{}, {}, {}, Q>

export type RequestParams<P, Q> = Request<P, {}, {}, Q>