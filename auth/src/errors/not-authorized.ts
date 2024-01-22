import { CustomError } from "./custom-error";

export class NotAuthrizedError extends CustomError{
    statusCode = 401;

    constructor(){
        super('Not authorized');

        Object.setPrototypeOf(this, NotAuthrizedError.prototype);
    }

    serializeErrors(){
        return [{ message: 'Not authorized'}];
    }
}