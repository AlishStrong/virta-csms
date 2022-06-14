import { NextFunction, Request, Response } from 'express';
import { Errors } from './error.enums';

const unknownEndpoint = (_request: Request, response: Response) => {
    response.status(404).send({ error: Errors.UNKNOWN_ENDPOINT });
};

const errorHandler = (error: Error, _request: Request, response: Response, next: NextFunction) => {
    switch (error.message) {
        case Errors.INCORRECT_ID:
            response.status(404).json({ error: Errors.INCORRECT_ID });
            break;
        default:
            response.status(500).json({ error: Errors.UNKNOWN_ISSUE });
            break;
    }
    next(error);
};

export default {
    unknownEndpoint,
    errorHandler
};
