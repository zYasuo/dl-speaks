import { DomainException } from "./domain.exception";

const HTTP_UNAUTHORIZED = 401;

export class InvalidCredentialsError extends DomainException {
    constructor(message: string = "Invalid credentials") {
        super(message, HTTP_UNAUTHORIZED, "INVALID_CREDENTIALS");
    }
}
