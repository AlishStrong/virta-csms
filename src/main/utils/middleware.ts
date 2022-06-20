import { NextFunction, Request, Response } from 'express';
import { Errors } from './error.enums';

const unknownEndpoint = (_request: Request, response: Response) => {
    response.status(404).send({ error: Errors.UNKNOWN_ENDPOINT });
};

const errorHandler = (error: Error, _request: Request, response: Response, next: NextFunction) => {
    // console.log(error);
    switch (error.message) {
        case Errors.INCORRECT_ID:
            response.status(404).json({ error: error.message });
            break;
        case Errors.WRONG_STRUCTURE:
            response.status(400).json({ error: error.message });
            break;
        case Errors.DUPLICATE_ENTRY:
            response.status(400).json({ error: error.message });
            break;
        case Errors.COMPANY_RELATIONSHIP:
            response.status(400).json({ error: error.message });
            break;
        case Errors.COMPANY_PARENTHOOD:
            response.status(400).json({ error: error.message });
            break;
        case Errors.PARENT_NOT_EXIST:
            response.status(404).json({ error: error.message });
            break;
        case Errors.CHILD_NOT_EXIST:
            response.status(404).json({ error: error.message });
            break;
        case Errors.COMPANY_NOT_EXIST:
            response.status(404).json({ error: error.message });
            break;
        case Errors.STATION_TYPE_NOT_EXIST:
            response.status(404).json({ error: error.message });
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
