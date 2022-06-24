import { Errors } from './error.enums';

const parseId = (id: string): number => {
    const parsedId = Number(id);
    if (parsedId) {
        return parsedId;
    } else {
        throw new Error(Errors.INCORRECT_ID);
    }
};

const validateIds = (ids: number[]): void => {
    for (const id of ids) {
        if (isNaN(id)) {
            throw new Error(Errors.INCORRECT_ID);
        }
    }
};

const isEmpty = (obj: object): boolean => {
    return Object.keys(obj).length === 0;
};

export default {
    parseId,
    validateIds,
    isEmpty
};
