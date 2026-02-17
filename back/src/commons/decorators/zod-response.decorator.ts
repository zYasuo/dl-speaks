import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { z } from "zod";
import { ZodResponseInterceptor } from "../interceptors/zod-response.interceptor";

export function ZodResponse(schema: z.ZodType) {
  return applyDecorators(
    UseInterceptors(new ZodResponseInterceptor(schema))
  );
}
