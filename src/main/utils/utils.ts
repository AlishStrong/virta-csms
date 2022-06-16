import { Errors } from './error.enums';

const parseId = (id: string): number => {
    const parsedId = Number(id);
    if (parsedId) {
        return parsedId;
    } else {
        throw new Error(Errors.INCORRECT_ID);
    }
};

const isEmpty = (obj: object): boolean => {
    return Object.keys(obj).length === 0;
};

export default {
    parseId,
    isEmpty
};
