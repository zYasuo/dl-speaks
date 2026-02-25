import { DomainException } from "./domain.exception";

const HTTP_NOT_FOUND = 404;
const HTTP_BAD_REQUEST = 400;

export class WordNotFoundError extends DomainException {
    constructor(message: string) {
        super(message, HTTP_NOT_FOUND, "WORD_NOT_FOUND");
    }
}

export class WordAlreadyInFavoriteError extends DomainException {
    constructor(message: string = "Word already in favorites") {
        super(message, HTTP_BAD_REQUEST, "WORD_ALREADY_IN_FAVORITE");
    }
}
