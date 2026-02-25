import { DomainException } from "./domain.exception";

const HTTP_NOT_FOUND = 404;

export class ItemNotFoundError extends DomainException {
    constructor(message: string = "Item not found") {
        super(message, HTTP_NOT_FOUND, "ITEM_NOT_FOUND");
    }
}
