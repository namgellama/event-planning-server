import type { NextFunction, Request, RequestHandler, Response } from "express";

export function asyncHandler<
    P = Record<string, string>,
    ResBody = any,
    ReqBody = any,
    ReqQuery = any,
>(
    fn: (
        req: Request<P, ResBody, ReqBody, ReqQuery>,
        res: Response<ResBody>,
        next: NextFunction,
    ) => Promise<void>,
): RequestHandler<P, ResBody, ReqBody, ReqQuery> {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
