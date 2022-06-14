import { Errors } from './error.enums';

const parseId = (id: string): number => {
    const parsedId = Number(id);
    if (parsedId) {
        return parsedId;
    } else {
        throw new Error(Errors.INCORRECT_ID);
    }
};

export default {
    parseId
};
