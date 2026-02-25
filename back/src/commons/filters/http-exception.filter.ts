import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalHttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const payload = exception.getResponse();
            const body =
                typeof payload === "object" && payload !== null
                    ? { statusCode: status, ...(payload as object) }
                    : { statusCode: status, message: payload };
            res.status(status).json(body);
            return;
        }

        this.logger.error(
            exception instanceof Error ? exception.message : String(exception),
            exception instanceof Error ? exception.stack : undefined
        );
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: "Internal server error",
        });
    }
}
