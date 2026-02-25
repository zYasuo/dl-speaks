export abstract class DomainException extends Error {
    public readonly httpStatus: number;
    public readonly code: string;

    constructor(message: string, httpStatus: number, code: string) {
        super(message);
        this.name = this.constructor.name;
        this.httpStatus = httpStatus;
        this.code = code;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export function isDomainException(e: unknown): e is DomainException {
    return e instanceof Error && "httpStatus" in e && typeof (e as DomainException).httpStatus === "number";
}
