import type { NextFunction, Request, Response } from "express";

export async function asyncHandler(
    func: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(func(req, res, next)).catch(next);
    };
}
