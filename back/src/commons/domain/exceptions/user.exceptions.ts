import { DomainException } from "./domain.exception";

const HTTP_NOT_FOUND = 404;
const HTTP_CONFLICT = 409;

export class UserNotFoundError extends DomainException {
    constructor(message: string = "User not found") {
        super(message, HTTP_NOT_FOUND, "USER_NOT_FOUND");
    }
}

export class UserAlreadyExistsError extends DomainException {
    constructor(message: string = "User already exists") {
        super(message, HTTP_CONFLICT, "USER_ALREADY_EXISTS");
    }
}
