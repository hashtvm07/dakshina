"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const expressApp = app.getHttpAdapter().getInstance();
    app.enableCors();
    const webPath = (0, path_1.join)(__dirname, '..', 'public', 'web-ui');
    const adminPath = (0, path_1.join)(__dirname, '..', 'public', 'admin-ui');
    app.use('/web-ui', express.static(webPath));
    app.use('/admin-ui', express.static(adminPath));
    expressApp.get('/web-ui/*', (req, res) => {
        res.sendFile((0, path_1.join)(webPath, 'index.html'));
    });
    expressApp.get('/admin-ui/*', (req, res) => {
        res.sendFile((0, path_1.join)(adminPath, 'index.html'));
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map