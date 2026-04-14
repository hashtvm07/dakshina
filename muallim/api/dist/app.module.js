"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const health_controller_1 = require("./health/health.controller");
const bootstrap_service_1 = require("./bootstrap/bootstrap.service");
const college_entity_1 = require("./colleges/entities/college.entity");
const colleges_module_1 = require("./colleges/colleges.module");
const muallim_entity_1 = require("./muallims/entities/muallim.entity");
const muallims_module_1 = require("./muallims/muallims.module");
const content_block_entity_1 = require("./site/entities/content-block.entity");
const media_asset_entity_1 = require("./site/entities/media-asset.entity");
const site_settings_entity_1 = require("./site/entities/site-settings.entity");
const site_module_1 = require("./site/site.module");
const user_entity_1 = require("./users/entities/user.entity");
const users_module_1 = require("./users/users.module");
const vacancy_entity_1 = require("./vacancies/entities/vacancy.entity");
const vacancies_module_1 = require("./vacancies/vacancies.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', '127.0.0.1'),
                    port: configService.get('DB_PORT', 5432),
                    username: configService.get('DB_USERNAME', 'postgres'),
                    password: configService.get('DB_PASSWORD', 'postgres'),
                    database: configService.get('DB_NAME', 'muallim_portal'),
                    autoLoadEntities: true,
                    entities: [user_entity_1.User, muallim_entity_1.Muallim, site_settings_entity_1.SiteSettings, content_block_entity_1.ContentBlock, media_asset_entity_1.MediaAsset, college_entity_1.College, vacancy_entity_1.Vacancy],
                    synchronize: configService.get('DB_SYNC', 'true') === 'true',
                    ssl: configService.get('DB_SSL', 'false') === 'true'
                        ? { rejectUnauthorized: false }
                        : false,
                }),
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, muallim_entity_1.Muallim, site_settings_entity_1.SiteSettings, content_block_entity_1.ContentBlock, media_asset_entity_1.MediaAsset, college_entity_1.College, vacancy_entity_1.Vacancy]),
            site_module_1.SiteModule,
            muallims_module_1.MuallimsModule,
            users_module_1.UsersModule,
            colleges_module_1.CollegesModule,
            vacancies_module_1.VacanciesModule,
        ],
        controllers: [health_controller_1.AppController],
        providers: [bootstrap_service_1.BootstrapService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map