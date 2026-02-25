import { NestFactory } from "@nestjs/core";
import { ApiV1Module } from "./modules/api/v1/api-v1.module";
import { GlobalHttpExceptionFilter } from "./commons/filters/http-exception.filter";

async function bootstrap() {
    const app = await NestFactory.create(ApiV1Module);

    app.setGlobalPrefix("api/v1");
    app.useGlobalFilters(new GlobalHttpExceptionFilter());
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
