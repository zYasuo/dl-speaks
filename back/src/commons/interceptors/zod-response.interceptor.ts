import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    InternalServerErrorException,
  } from "@nestjs/common";
  import { Observable } from "rxjs";
  import { map } from "rxjs/operators";
  import { z } from "zod";
  
  @Injectable()
  export class ZodResponseInterceptor implements NestInterceptor {
    constructor(private schema: z.ZodType) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data) => {
          const result = this.schema.safeParse(data);
  
          if (!result.success) {
            throw new InternalServerErrorException({
              message: "Response validation failed",
              errors: result.error.flatten(),
            });
          }
  
          return result.data;
        })
      );
    }
  }
  