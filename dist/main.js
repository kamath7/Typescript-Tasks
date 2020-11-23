"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const config = require("config");
async function bootstrap() {
    const logger = new common_1.Logger('bootstrap');
    const serverConfig = config.get('server');
    console.log(serverConfig);
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    if (process.env.NODE_ENV === 'development') {
        app.enableCors();
    }
    const port = process.env.port || serverConfig.port;
    await app.listen(port);
    logger.log(`Application listening on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map