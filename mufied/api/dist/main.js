"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_service_1 = require("./config/config-service");
const load_env_1 = require("./config/load-env");
const express = require("express");
async function bootstrap() {
    (0, load_env_1.loadEnvFile)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_service_1.ConfigService);
    const port = Number(process.env.PORT || config.server?.port || 8080);
    app.enableCors({
        origin: config.cors?.origins ?? ['*'],
    });
    app.use(express.json({ limit: '2mb' }));
    app.use(express.urlencoded({ extended: true, limit: '2mb' }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    await app.listen(port, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map