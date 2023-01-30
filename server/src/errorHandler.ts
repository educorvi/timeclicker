import {
    Response as ExResponse,
    Request as ExRequest,
    NextFunction,
} from "express";
import { ValidateError } from "tsoa";
import {UnauthorizedError} from "./authentication";

export function errorHandler(
    err: unknown,
    req: ExRequest,
    res: ExResponse,
    next: NextFunction
): ExResponse | void {
    if (err instanceof ValidateError) {
        console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(422).json({
            message: "Validation Failed",
            details: err?.fields,
        });
    }
    if (err instanceof UnauthorizedError) {
        return res.status(401).json({
            message: "Unauthorized",
            details: err.message
        });
    }

    if (err instanceof Error) {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }

    next();
}
